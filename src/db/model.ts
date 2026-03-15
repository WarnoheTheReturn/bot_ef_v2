import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';


export abstract class BaseModel<T extends RowDataPacket> {
  protected pool: Pool;
  
  public abstract tableName: string;
  public abstract primaryKey: string;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async getAll(): Promise<T[]> {
    const [rows] = await this.pool.execute<T[]>(`SELECT * FROM ${this.tableName}`);
    return rows;
  }

  public async getById(id: number | string): Promise<T | null> {
    const [rows] = await this.pool.execute<T[]>(
      `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`,
      [id]
    );
    return rows[0] || null;
  }

  public async update(id: number | string, data: Partial<T>): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      `UPDATE ${this.tableName} SET ? WHERE ${this.primaryKey} = ?`,
      [Object.values(data), id]
    );
    return result.affectedRows > 0;
  }

  public async delete(id: number | string): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}
