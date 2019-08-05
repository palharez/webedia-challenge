const Joi = require('joi')

module.exports = {
  body: {
    comment: Joi.string().required(),
    article: Joi.string().required()
  }
}
