const express = require('express')
const app = express()
const cors = require('cors')

const BlogDBService = require('./model/BlogDBService')

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response, next) => {
  BlogDBService.find({}).then(blogs => {
    response.json(blogs)
  }).catch(err => next(err))
})

app.post('/api/blogs', (request, response, next) => {
  const blog = new BlogDBService(request.body)

  blog.save().then(result => {
    response.status(201).json(result)
  }).catch(err => next(err))
})

module.exports = app