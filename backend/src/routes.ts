import express from 'express';
import multer from 'multer';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

import multerConfig from './config/multer';

import createPointValidation from './validations/create-point';

const upload = multer(multerConfig);

const router = express.Router();

router.get('/items', ItemsController.index);

router.post(
  '/points',
  upload.single('image'),
  createPointValidation,
  PointsController.create
);
router.get('/points', PointsController.index);
router.get('/points/:id', PointsController.show);

export default router;
