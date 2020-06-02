import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/users', (req, res) => {
  res.json({ hello: true });
});

app.listen(3333, () => {
  console.log('App listening at http://localhost:3333/');
});
