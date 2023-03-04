const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().integer().required(),
  albumId: Joi.string().required(),
});

module.exports = { AlbumPayloadSchema };
