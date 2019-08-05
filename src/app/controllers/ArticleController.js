const Article = require('../models/Article')

class ArticleController {
  async index (req, res) {
    const limit = parseInt(req.query.limit) || 20
    const page = parseInt(req.query.page) - 1 || 0
    const articles = await Article.find()
      .sort('-createdAt')
      .skip(page)
      .limit(limit)

    return res.json({ articles, page: page + 1, limit })
  }

  async show (req, res) {
    try {
      const article = await Article.findById(req.params.id).populate('authors')

      res.json(article)
    } catch (error) {
      return res.status(400).send()
    }
  }

  async showPl (req, res) {
    try {
      const article = await Article.findOne({
        permalink: req.params.pl
      }).populate('authors')

      res.json(article)
    } catch (error) {
      return res.status(400).send()
    }
  }

  async store (req, res) {
    try {
      const article = await Article.create(req.body)

      return res.status(201).json(article)
    } catch (error) {
      console.log(error)
      return res.status(400).send()
    }
  }

  async update (req, res) {
    try {
      const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      })

      return res.json(article)
    } catch (error) {
      return res.status(400).send()
    }
  }

  async destroy (req, res) {
    try {
      await Article.findByIdAndDelete(req.params.id)

      return res.status(204).send()
    } catch (error) {
      return res.status(400).send()
    }
  }
}

module.exports = new ArticleController()
