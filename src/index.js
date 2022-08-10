import config from './config.js';
import routes from './routes.js';
import express from 'express';
// import cors from 'cors';

const app = express();

// app.use(cors());
app.use(routes);

app.listen(config.APP_PORT || 3200, () =>
  console.log('Example app listening on port 3000!'),
);
// const http = require('http');
// const server = http.Server(app);
// app.use(express.json());

// server.listen(process.env.LISTEN_PORT);