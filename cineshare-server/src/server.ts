import express from 'express';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';

import models, { sequelize } from './models';
import seedDb from './seed/seedDb';
import server from './graphql';

const app = express();
app.use('*', cors());
app.use(compression());
server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);

const eraseDatabaseOnSync = true;
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    await seedDb(models);
  }

  httpServer.listen(
    { port: 3000 },
    (): void => console.log(`\n🚀      GraphQL is now running on http://localhost:3000/graphql`));
});