import { Request, Response } from 'express';
import knex from '../database/connection';

const { API_URL } = process.env;

class ItemsController {
  async index(req: Request, res: Response) {
    const items = await knex('items').select('*');

    const serializedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      image_url: `${API_URL}/assets/${item.image}`,
    }));

    return res.json(serializedItems);
  }
}

export default new ItemsController();
