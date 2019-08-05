const Joi = require('joi')

module.exports = {
  body: {
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    content: Joi.string().required(),
    authors: Joi.array()
      .items(Joi.string())
      .required()
  }
}
