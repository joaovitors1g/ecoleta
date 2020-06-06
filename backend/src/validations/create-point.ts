import { celebrate, Joi } from 'celebrate';

export default celebrate(
  {
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      whatsapp: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().length(2).required(),
      items: Joi.string()
        .regex(/(\d+)(,\s*\d+)*/)
        .required(),
    }),
  },
  {
    abortEarly: false,
  }
);
