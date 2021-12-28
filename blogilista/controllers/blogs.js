const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
	blogs = await Blog.find({})
	response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
	const blog = new Blog(request.body)

	result = await blog.save()
	response.status(201).json(result)

})

blogRouter.delete('/:id', async (request, response) => {
	const id = request.params.id

	await Blog.findByIdAndDelete(id)

	response.status(204).send()
})

blogRouter.put('/:id', async (request, response) => {
	const id = request.params.id
	const newBlog = request.body

	const result = await Blog.findByIdAndUpdate(id, newBlog, { new: true })
	response.status(200).json(result)
})

module.exports = blogRouter