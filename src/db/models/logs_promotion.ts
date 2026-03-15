import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface LogsPromotionRow extends RowDataPacket {
  id: number;
  previous_grade_id : number;
  updated_grade_id : number;
}

export class LogsPromotionModel extends BaseModel<LogsPromotionRow> {
  public tableName = 'logs_promotion';
  public primaryKey = 'id';
}


