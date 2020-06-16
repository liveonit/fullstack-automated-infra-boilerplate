import * as path from 'path'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'

type DbOptions = PostgresConnectionOptions | MysqlConnectionOptions | SqliteConnectionOptions

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
  type: isDbType(process.env.DB_TYPE) ? process.env.DB_TYPE : 'mysql',
  host: process.env.DB_HOST,
  port: parseInt((process.env.DB_PORT || "3306"), 10),
  username: process.env.DB_USER || "default_username",
  password: process.env.DB_PASSWORD || "default_pass",
  database: process.env.DB_NAME || "default_db_name",
  migrations: [ path.resolve(__dirname, 'migrations/**/*{.js,.ts}')],
  cli: {
    migrationsDir: path.resolve(__dirname, 'migrations/'),
  },
  logging: ["error", "query", "schema"],
  timezone: "UTC",
  dateStrings:  ["TIMESTAMP", "DATETIME", "DATE"]
}

console.log("current migrations path", path.resolve(__dirname, 'migrations/'));
const staging: DbOptions = {
  name: "default",
  type: isDbType(process.env.DB_TYPE) ? process.env.DB_TYPE : 'mysql',
  host: process.env.DB_HOST,
  port: parseInt((process.env.DB_PORT || "3306"), 10),
  username: process.env.DB_USER || "default_username",
  password: process.env.DB_PASSWORD || "default_pass",
  database: process.env.DB_NAME || "default_db_name",
  migrations: [ path.resolve(__dirname, 'migrations/**/*{.js,.ts}')],
  cli: {
    migrationsDir: path.resolve(__dirname, 'migrations/'),
  },
}
const production: DbOptions = {
  name: "default",
  type: isDbType(process.env.DB_TYPE) ? process.env.DB_TYPE : 'mysql',
  host: process.env.DB_HOST,
  port: parseInt((process.env.DB_PORT || "3306"), 10),
  username: process.env.DB_USER || "default_username",
  password: process.env.DB_PASSWORD || "default_pass",
  database: process.env.DB_NAME || "default_db_name",
  migrations: [ path.resolve(__dirname, 'migrations/**/*{.js,.ts}')],
  cli: {
    migrationsDir: path.resolve(__dirname, 'migrations/'),
  },
}

const configs = (environment: string): DbOptions => {
  switch (environment) {
    case 'production':
      return production;
    case 'staging':
      return staging;
    case 'development':
      return development;
    default: 
      return development;
  }
}

let connectionOptions = configs('development');


if (require.main === module) {
  var myArgs = process.argv.slice(2);
  if (myArgs.length > 0) {
    connectionOptions = configs(myArgs[0]);
  }
}

module.exports = connectionOptions;