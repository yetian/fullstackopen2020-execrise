const express = require('express')
const app = express()
const cors = require('cors')

const BlogDBService = require('./model/BlogDBService')

app.use(cors())
app.use(express.json())

app.get('/api/blogs', async (request, response, next) => {
  try {
    let blogs = await BlogDBService.find({})
    response.json(blogs)
  } catch (err) {
    next(err)
  }
})

app.post('/api/blogs', async (request, response, next) => {
  try {
    let newBlog = request.body
    if (newBlog.likes === undefined) {
      newBlog.likes = 0
    }

    if (newBlog.title === undefined || newBlog.url === undefined) {
      response.status(400).end()
    }

    const blog = new BlogDBService(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  } catch (err) {
    next(err)
  }
})

module.exports = app