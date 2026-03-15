import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface LogsMedalRow extends RowDataPacket {
  id: number;
  medal_id : number;
  level : number;
  is_awarded : boolean;
}

export class LogsMedalModel extends BaseModel<LogsMedalRow> {
  public tableName = 'logs_medal';
  public primaryKey = 'id';
}


