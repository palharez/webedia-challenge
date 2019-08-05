const Author = require('../models/Author')

class AuthorController {
  async index (req, res) {
    const limit = parseInt(req.query.limit) || 20
    const page = parseInt(req.query.page) - 1 || 0
    const authors = await Author.find()
      .sort('-createdAt')
      .skip(page)
      .limit(limit)

    return res.json({ authors, page: page + 1, limit })
  }

  async store (req, res) {
    const author = await Author.create(req.body)

    return res.status(201).json(author)
  }

  async update (req, res) {
    try {
      const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      })

      return res.status(200).json(author)
    } catch (error) {
      return res.status(400).send()
    }
  }

  async destroy (req, res) {
    try {
      await Author.findByIdAndDelete(req.params.id)

      return res.status(204).send()
    } catch (error) {
      return res.status(400).send()
    }
  }
}

module.exports = new AuthorController()
