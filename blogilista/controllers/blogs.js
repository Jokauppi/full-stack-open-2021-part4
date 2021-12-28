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

module.exports = blogRouter