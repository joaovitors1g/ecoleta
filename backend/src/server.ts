import express from 'express';

const app = express();

app.get('/users', (req, res) => {
  res.json({ hello: true });
});

app.listen(3333, () => {
  console.log('App listening at http://localhost:3333/');
});
