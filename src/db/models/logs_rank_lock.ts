import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface LogsRankLockRow extends RowDataPacket {
  id: number;
  grade_id : number;
  is_locked : boolean;
  duration : Date
}

export class LogsRankLockModel extends BaseModel<LogsRankLockRow> {
  public tableName = 'logs_rank_lock';
  public primaryKey = 'id';
}


