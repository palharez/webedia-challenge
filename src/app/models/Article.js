const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    authors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
      }
    ],
    permalink: {
      type: String
    }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

ArticleSchema.pre('save', function (next) {
  if (!this.isModified('permalink')) {
    this.permalink = `${this.title}-${this.subtitle}-${Date.now()}`
  }

  this.updatedAt = Date.now()
  next()
})

ArticleSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Article', ArticleSchema)
