const Pool = require('pg').Pool;

export default new Pool({ 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

export const getSingleRow = async (queryPromise) => {
  const result = await queryPromise;
  if (result.rowCount = 0) {
    return undefined;
  }

  return result.rows[0];
};