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
        image:
          'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
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

    await trx.commit();

    return res.status(201).json(point);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return res.status(404).json({ message: 'Point not found' });
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return res.json({
      point,
      items,
    });
  }

  async index(req: Request, res: Response) {
    const { uf, city, items } = req.query;

    const parsedItems = String(items)
      .split(/,\s?/)
      .map((item) => Number(item));

    console.log();

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .whereRaw('LOWER(city) = LOWER(?)', [String(city)])
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return res.json(points);
  }
}

export default new PointsController();
