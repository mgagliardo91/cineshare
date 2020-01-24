import nodeMigrate from 'node-pg-migrate';
import path from 'path';
import bodyParser from 'body-parser';
import express from 'express';
import config from 'config';
import routes from './routes';
import { ApiError } from './error';

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use('/api/v1', routes.reduce((router, route) => {
  route(router);
  return router;
}, express.Router()));

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message });
  }
  res.status(500).json({ error: err.stack });
});

nodeMigrate({
  databaseUrl: config.get('db'),
  dir: path.join(__dirname, '../migrations/'),
  direction: 'up',
  migrationsTable: 'migrations'
}).then(() => {
  app.listen(port, () => console.log(`Server is running on port ${port}`));
});