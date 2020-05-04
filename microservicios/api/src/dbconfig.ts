import * as path from 'path'
import { Env } from './utils/environment'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'

export type DbOptions = PostgresConnectionOptions | MysqlConnectionOptions | SqliteConnectionOptions

type DbType = "mysql" | "postgres" | "mariadb" | "sqlite"

const isDbType = (value: string = ""): value is DbType  => {
  switch(value) {
    case "mysql":
    case "mariadb":
    case "postgres":
    case "sqlite":
      return true;
    default:
      return false;
  }
}

const development: DbOptions = {
  name: "default",
  type: isDbType(process.env.DB_TYPE) ? process.env.DB_TYPE : 'sqlite',
  database: process.env.DB_NAME || path.resolve(__dirname, "../dev_db.sqlite3"),
  username: process.env.DB_USER || "default_username",
  password: process.env.DB_PASSWORD || "default_pass",
  entities: [path.resolve(__dirname, './models/**/*{.js,.ts}')],
  synchronize: true,
  logging: ["error", "query", "schema"]
}

const staging: DbOptions = {
  name: "default",
  type: isDbType(process.env.DB_TYPE) ? process.env.DB_TYPE : 'mysql',
  host: process.env.DB_HOST,
  port: parseInt((process.env.DB_PORT || "3306"), 10),
  username: process.env.DB_USER || "default_username",
  password: process.env.DB_PASSWORD || "default_pass",
  database: process.env.DB_NAME || "default_db_name", 
  synchronize: true,
  entities: [path.resolve(__dirname, './models/**/*{.js,.ts}')],
  migrations: [
    'src/database/migrations/*.ts',
  ],
  cli: {
    migrationsDir: 'src/database/migrations',
  }
}

const production: DbOptions = {
  name: "default",
  type: isDbType(process.env.DB_TYPE) ? process.env.DB_TYPE : 'mysql',
  host: process.env.DB_HOST,
  port: parseInt((process.env.DB_PORT || "3306"), 10),
  username: process.env.DB_USER || "default_username",
  password: process.env.DB_PASSWORD || "default_pass",
  database: process.env.DB_NAME || "default_db_name", 
  synchronize: true,
  entities: [path.resolve(__dirname, './models/**/*{.js,.ts}')],
  migrations: [
    'src/database/migrations/*.ts',
  ],
  cli: {
    migrationsDir: 'src/database/migrations',
  }
}

export const configs = (environment: Env): DbOptions => {
  switch (environment) {
    case 'production':
      return production;
    case 'staging':
      return staging;
    case 'development':
      return development;
  }
}