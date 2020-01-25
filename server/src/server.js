import nodeMigrate from 'node-pg-migrate';
import path from 'path';
import bodyParser from 'body-parser';
import express from 'express';
import logger from 'morgan';
import './config';
import routes from './routes';
import { authorizeRoute } from './middleware/auth';
import { ApiError } from './error';

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
}

routes.map(({ path, routes, private: privatePath }) => {
  const router = express.Router();
  if (typeof privatePath === 'undefined' || privatePath == true) {
    router.use(authorizeRoute);
  }

  routes.map(r => r(router));
  app.use(`/api/v1${path}`, router);
});

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message });
  }
  res.status(500).json({ error: err.stack });
});

nodeMigrate({
  databaseUrl: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  },
  dir: path.join(__dirname, '../migrations/'),
  direction: 'up',
  migrationsTable: 'migrations'
}).then(() => {
  app.listen(port, () => console.log(`Server is running on port ${port}`));
});