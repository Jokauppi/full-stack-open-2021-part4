const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'missing or invalid token' })
  }

  const blogData = request.body

  blogData.user = user._id

  const blog = new Blog(blogData)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await User.findByIdAndUpdate(user._id, user, { new: true })

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'missing or invalid token' })
  }

  const blogUserId = (await Blog.findById(id)).user

  if (blogUserId.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(id)
    response.status(204).send()
  }

})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const newBlog = request.body

  const result = await Blog.findByIdAndUpdate(id, newBlog, { new: true })
  response.status(200).json(result)
})

module.exports = blogRouter