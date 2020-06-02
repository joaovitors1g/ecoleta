import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
  async create(req: Request, res: Response) {
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

    const [point] = await trx('points')
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
      .returning('*');

    const pointItems = items.map((item_id: string) => ({
      item_id,
      point_id: point.id,
    }));

    await trx('point_items').insert(pointItems);

    return res.status(201).json(point);
  }
}

export default new PointsController();
