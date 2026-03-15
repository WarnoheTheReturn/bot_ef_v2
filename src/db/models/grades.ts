import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface GradesRow extends RowDataPacket {
  role_id: number;
  xp_requirements : number;
}

export class GradesModel extends BaseModel<GradesRow> {
  public tableName = 'grades';
  public primaryKey = 'role_id';
}


