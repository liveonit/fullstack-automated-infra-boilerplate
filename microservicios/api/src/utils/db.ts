import { createConnection, getConnection, getConnectionManager, Connection } from 'typeorm'
import { configs, DbOptions } from '../dbconfig'

import { isEnv } from './environment'

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
  }
}