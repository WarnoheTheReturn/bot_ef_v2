import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface LogsXpRow extends RowDataPacket {
  id: number;
  previous : number;
  updated : number;
}

export class LogsXpModel extends BaseModel<LogsXpRow> {
  public tableName = 'logs_xp';
  public primaryKey = 'id';
}


