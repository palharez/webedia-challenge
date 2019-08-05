const Comment = require('../models/Comment')

class CommentController {
  async index (req, res) {
    const limit = parseInt(req.query.limit) || 20
    const page = parseInt(req.query.page) - 1 || 0
    const comments = await Comment.find()
      .sort('-createdAt')
      .skip(page)
      .limit(limit)

    return res.json({ comments, page: page + 1, limit })
  }

  async show (req, res) {
    try {
      const comment = await Comment.find({
        article: req.params.id
      }).populate('user')

      return res.json(comment)
    } catch (error) {
      return res.status(400).send()
    }
  }

  async store (req, res) {
    try {
      const comment = await Comment.create({ ...req.body, user: req.userId })

      return res.status(201).json(comment)
    } catch (error) {
      console.log(error)
      return res.status(400).send()
    }
  }

  async update (req, res) {
    try {
      const { user } = await Comment.findById(req.params.id)

      if (!user === req.userId) {
        res.status(401)
      }

      const comment = await Comment.findByIdAndUpdate(
        req.params.id,
        { ...req.body, user: user },
        { new: true }
      )

      return res.json(comment)
    } catch (error) {
      return res.status(400).send()
    }
  }

  async destroy (req, res) {
    try {
      const { user } = await Comment.findById(req.params.id)

      if (!user === req.userId) {
        res.status(401)
      }

      await Comment.findByIdAndDelete(req.params.id)

      return res.status(204).send()
    } catch (error) {
      return res.status(400).send()
    }
  }
}

module.exports = new CommentController()
