const mongoose = require('mongoose')
const resource = require('./test_resources')

const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

describe('When there are blogs in the database', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(resource.initialBlogs)
  })

  test('blogs are returned as JSON', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    let response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(resource.initialBlogs.length)
  })

  test('returned blogs have attribute id', async () => {
    let response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })

})

describe('When adding a blog', () => {

  const newBlog = {
    title: "blog3",
    author: "blogger3",
    url: "blog.3.example",
    likes: 0
  }

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(resource.initialBlogs)
  })

  test('amount of blogs should increase', async () => {
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)

    expect(await resource.getBlogs()).toHaveLength(resource.initialBlogs.length + 1)
  })

  test('database should contain added blog', async () => {
    await api.post('/api/blogs')
      .send(newBlog)

    expect((await resource.getBlogs()).some(blog =>
      blog.title === newBlog.title &&
      blog.author === newBlog.author &&
      blog.url === newBlog.url &&
      blog.likes === newBlog.likes
    )).toBe(true)
  })

  test('likes is set to 0 when not specified', async () => {
    let response = await api.post('/api/blogs')
      .send({title: "blog", author: "blogger", url: "blog.example"})

    expect(response.body.likes).toEqual(0)
  })

  test('returns 400 Bad Request when title and url are missing', async () => {
    let response = await api.post('/api/blogs')
      .send({author: "blogger"})
      .expect(400)
  })

})

describe('When deleting a blog', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(resource.initialBlogs)
  })

  test('amount of blogs should decrease', async () => {
    let blogs = await resource.getBlogs()

    await api.delete(`/api/blogs/${blogs[0].id}`).expect(204)
    
    expect(await resource.getBlogs()).toHaveLength(resource.initialBlogs.length - 1)
  })

  test('database should not contain deleted blog', async () => {
    let blogs = await resource.getBlogs()
    
    await api.delete(`/api/blogs/${blogs[0].id}`)

    expect(await resource.getBlogs()).not.toContainEqual(blogs[0])
  })

})

afterAll(() => {
  mongoose.connection.close()
})