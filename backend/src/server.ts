import { config as configEnv } from 'dotenv';

configEnv();

import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import routes from './routes';
import path from 'path';

const app = express();

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'static')));

app.use(express.json());

app.use(cors());

app.use(errors());

app.use(routes);

app.listen(3333, () => {
  console.log('App listening at http://localhost:3333/');
});
