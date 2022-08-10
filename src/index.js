import config from './config.js';
import { routes } from './routes.js';
import express from 'express';

const app = express();

app.listen(config.APP_PORT || 3200, () =>
  console.log('Example app listening on port 3000!'),
);

app.use('/api/v1', routes);