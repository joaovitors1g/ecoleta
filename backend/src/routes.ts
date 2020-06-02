import express, { response } from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  return response.json({ message: 'Hello NLW' });
});

export default router;
