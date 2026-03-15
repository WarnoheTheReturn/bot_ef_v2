  import * as mysql from 'mysql2/promise';
  import { config } from '../config';
  import { GradesModel } from './models/grades';
  import { LogsInactivityModel } from './models/logs_inactivity';
  import { LogsInfoModel } from './models/logs_info';
  import { LogsMedalModel } from './models/logs_medal';
  import { LogsPromotionModel } from './models/logs_promotion';
  import { LogsRankLockModel } from './models/logs_rank_lock';
  import { LogsTypeModel } from './models/logs_type';
  import { LogsXpModel } from './models/logs_xp';
  import { MedalsModel } from './models/medals';
  import { UsersMedalsModel } from './models/users_medals';
  import { UsersModel } from './models/users';

  export class Database {
    public pool: mysql.Pool;
    public tables: {
      grades: GradesModel;
      logs_inactivity: LogsInactivityModel;
      logs_info: LogsInfoModel;
      logs_medal: LogsMedalModel;
      logs_promotion: LogsPromotionModel;
      logs_rank_lock: LogsRankLockModel;
      logs_type: LogsTypeModel;
      logs_xp: LogsXpModel;
      medals: MedalsModel;
      users_medals: UsersMedalsModel;
      users: UsersModel;
    };

    constructor() {
      this.pool = mysql.createPool({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name,
        waitForConnections: true,
        connectionLimit: 10,
      });

      this.tables = {
        grades : new GradesModel(this.pool),
        logs_inactivity : new LogsInactivityModel(this.pool),
        logs_info : new LogsInfoModel(this.pool),
        logs_medal : new LogsMedalModel(this.pool),
        logs_promotion : new LogsPromotionModel(this.pool),
        logs_rank_lock : new LogsRankLockModel(this.pool),
        logs_type : new LogsTypeModel(this.pool),
        logs_xp : new LogsXpModel(this.pool),
        medals : new MedalsModel(this.pool),
        users_medals : new UsersMedalsModel(this.pool),
        users : new UsersModel(this.pool)
      };
      
    }

    public async testConnection() {
      const conn = await this.pool.getConnection();
      console.log('✅ !');
      conn.release();
    }
  }

