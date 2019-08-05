const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  }
})

CommentSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Comment', CommentSchema)
