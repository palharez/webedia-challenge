const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

AuthorSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Author', AuthorSchema)
