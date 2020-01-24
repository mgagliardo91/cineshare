import config from 'config';
const Pool = require('pg').Pool;
export default new Pool(config.get('db'));