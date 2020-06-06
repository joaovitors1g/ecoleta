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
        image: req.file.filename,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      })
      .returning('*');

    const pointItems = items
      .split(/,\s?/)
      .map((item_id: string) => Number(item_id))
      .map((item_id: number) => ({
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

    point.image_url = `${process.env.API_URL}/uploads/${point.image}`;

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

    try {
      const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItems)
        .whereRaw('LOWER(city) = LOWER(?)', [String(city)])
        .where('uf', String(uf))
        .distinct()
        .select('points.*');

      const serializedPoints = points.map((point) => ({
        ...point,
        image_url: `${process.env.API_URL}/uploads/${point.image}`,
      }));

      return res.json(serializedPoints);
    } catch (error) {
      return res.status(500).json([]);
    }
  }
}

export default new PointsController();
