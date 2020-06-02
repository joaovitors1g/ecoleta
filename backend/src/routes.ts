import express from 'express';

import knex from './database/connection';

const router = express.Router();

router.get('/items', async (req, res) => {
  const items = await knex('items').select('*');

  const serializedItems = items.map((item) => ({
    id: item.id,
    title: item.title,
    image_url: `http://localhost:3333/uploads/${item.image}`,
  }));

  return res.json(serializedItems);
});

router.post('/points', async (req, res) => {
  const {
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
    items,
  } = req.body;

  const trx = await knex.transaction();

  const [point_id] = await trx('points')
    .insert({
      image: 'image-fake',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    })
    .returning('id');

  const pointItems = items.map((item_id: string) => ({
    item_id,
    point_id,
  }));

  await trx('point_items').insert(pointItems);

  return res.status(201).send();
});

export default router;
