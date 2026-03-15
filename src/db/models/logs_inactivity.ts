import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface LogsInactivityRow extends RowDataPacket {
  id: number;
  duration : Date;
}

export class LogsInactivityModel extends BaseModel<LogsInactivityRow> {
  public tableName = 'logs_inactivity';
  public primaryKey = 'id';
}


