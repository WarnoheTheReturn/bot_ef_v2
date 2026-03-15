import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface UsersMedalsRow extends RowDataPacket {
  user_id: number;
  medal_id : number;
  level : number
}

export class UsersMedalsModel extends BaseModel<UsersMedalsRow> {
  public tableName = 'users_medals';
  public primaryKey = 'user_id-medal_id';
}
