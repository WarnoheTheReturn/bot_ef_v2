import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface MedalsRow extends RowDataPacket {
  role_id: number;
  name : string;
}

export class MedalsModel extends BaseModel<MedalsRow> {
  public tableName = 'medals';
  public primaryKey = 'role_id';
}
