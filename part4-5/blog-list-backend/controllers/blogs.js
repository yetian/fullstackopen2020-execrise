const blogsRouter = require('express').Router()
const Blog = require('../model/BlogDBService')
const User = require('../model/UserDBService')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response, next) => {
  try {
    let blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map(b => b.toJSON()))
  } catch (err) {
    next(err)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    let newBlog = request.body
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    newBlog.user = user._id
    if (newBlog.likes === undefined) {
      newBlog.likes = 0
    }

    if (newBlog === undefined || newBlog.title === undefined || newBlog.url === undefined) {
      response.status(400).end()
    }

    const blog = new Blog(newBlog)
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    response.status(201).json(result)
  } catch (err) {
    next(err)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
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

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    if (user._id.toString() !== blog.user.toString()) {
      response.status(401).end()
    }

    let updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
    response.json(updatedBlog)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    if (id === undefined) {
      response.status(400).end()
    }
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(id)
    if (user._id.toString() !== blog.user.toString()) {
      response.status(401).end()
    }
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } catch (err) {
    next(err)
  }
})

module.exports = blogsRouter