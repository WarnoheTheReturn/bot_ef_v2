import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface UsersRow extends RowDataPacket {
  id: number;
  roblox_id : number;
  xp : number;
  current_grade : number;
  black_listed : boolean;
  in_faction : boolean;
  in_tww_faction : boolean;
  rank_lock_grade_id : number;
  is_inactivity : boolean;
}

export class UsersModel extends BaseModel<UsersRow> {
  public tableName = 'users';
  public primaryKey = 'id';
}
