import { configs } from '../dbconfig'
import { isEnv } from './environment'
let connectionOptions = configs('development');
if (require.main === module) {
  var myArgs = process.argv.slice(2);
  if (myArgs.length > 0 && isEnv(myArgs[0])) {
    connectionOptions = configs(myArgs[0]);
  }
}

module.exports = connectionOptions;