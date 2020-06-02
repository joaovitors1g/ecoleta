import express from 'express';

import knex from './database/connection';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const router = express.Router();

router.get('/items', ItemsController.index);

router.post('/points', PointsController.create);
router.get('/points/:id', PointsController.show);

export default router;
