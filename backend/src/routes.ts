import express from 'express';
import multer from 'multer';

import knex from './database/connection';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

import multerConfig from './config/multer';

const upload = multer(multerConfig);

const router = express.Router();

router.get('/items', ItemsController.index);

router.post('/points', upload.single('image'), PointsController.create);
router.get('/points', PointsController.index);
router.get('/points/:id', PointsController.show);

export default router;
