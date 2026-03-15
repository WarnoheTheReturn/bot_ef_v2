import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface LogsTypeRow extends RowDataPacket {
  id: number;
  name : string;
}

export class LogsTypeModel extends BaseModel<LogsTypeRow> {
  public tableName = 'logs_type';
  public primaryKey = 'id';
}


