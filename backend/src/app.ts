import 'dotenv/config';

import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import Youch from 'youch';
import helmet from 'helmet';
import { errors } from 'celebrate';

import 'express-async-errors';

import routes from './routes';

class App {
  public server: Express;
  constructor() {
    this.server = express();

    this.middlewares();

    this.routes();

    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(helmet());
    this.server.use(
      '/assets',
      express.static(path.resolve(__dirname, '..', 'static'))
    );

    this.server.use(
      '/uploads',
      express.static(path.resolve(__dirname, '..', 'uploads'))
    );

    this.server.use(errors());
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(
      async (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (process.env.NODE_ENV === 'development') {
          const errors = await new Youch(err, req).toJSON();

          return res.status(500).json(errors);
        }
        return res.status(500).json({ error: 'Internal server error' });
      }
    );
  }
}

export default new App().server;
