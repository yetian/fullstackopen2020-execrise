const express = require('express')
const app = express()
const cors = require('cors')

const Blog = require('./model/BlogDBService')

app.use(cors())
app.use(express.json())

app.get('/api/blogs', async (request, response, next) => {
  try {
    let blogs = await Blog.find({})
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

    if (newBlog === undefined || newBlog.title === undefined || newBlog.url === undefined) {
      response.status(400).end()
    }

    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  } catch (err) {
    next(err)
  }
})

app.put('/api/blogs/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const blog = request.body

    if (id === undefined) {
      response.status(400).end()
    }

    if (blog.likes === undefined) {
      blog.likes = 0
    }

    if (blog === undefined || blog.title === undefined || blog.url === undefined) {
      response.status(400).end()
    }

    let updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
    response.json(updatedBlog)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

app.delete('/api/blogs/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    if (id === undefined) {
      response.status(400).end()
    }
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } catch (err) {
    next(err)
  }
})

module.exports = app