import * as path from 'path'
import { Env, isEnv } from './utils/environment'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'
import { createConnection, getConnection, getConnectionManager, Connection } from 'typeorm'


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
  database: process.env.API_DB_NAME || "default_db_name", 
  synchronize: false,
  entities: [path.resolve(__dirname, './models/**/*{.js,.ts}')],
  logging: ["error", "query", "schema"],
}

const staging: DbOptions = {
  name: "default",
  type: isDbType(process.env.DB_TYPE) ? process.env.DB_TYPE : 'mysql',
  host: process.env.DB_HOST,
  port: parseInt((process.env.DB_PORT || "3306"), 10),
  username: process.env.DB_USER || "default_username",
  password: process.env.DB_PASSWORD || "default_pass",
  database: process.env.API_DB_NAME || "default_db_name", 
  synchronize: false,
  entities: [path.resolve(__dirname, './models/**/*{.js,.ts}')],
  
}

const production: DbOptions = {
  name: "default",
  type: isDbType(process.env.DB_TYPE) ? process.env.DB_TYPE : 'mysql',
  host: process.env.DB_HOST,
  port: parseInt((process.env.DB_PORT || "3306"), 10),
  username: process.env.DB_USER || "default_username",
  password: process.env.DB_PASSWORD || "default_pass",
  database: process.env.API_DB_NAME || "default_db_name", 
  synchronize: false,
  entities: [path.resolve(__dirname, './models/**/*{.js,.ts}')],
}

const configs = (environment: Env): DbOptions => {
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

const currentConfig: DbOptions = configs(isEnv(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development')  

export const connectDb: () => Promise<Connection> = async (): Promise<Connection> => {
  try {
    if (!getConnectionManager().has("default")) {
      return await createConnection(currentConfig);
    }
    if (!getConnection().isConnected) {
      return await getConnection().connect();
    }
    else {
      return getConnection()
    }
  }
  catch (err) {
    console.error(err)
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging') {
      throw new Error("Error al conectar con la base de datos, parametros de conexion: " + currentConfig);
    }
    else {
      throw new Error("Error al conectar con la base de datos");
    }
  }
}