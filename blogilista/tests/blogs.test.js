const mongoose = require('mongoose')
const resource = require('./test_resources')

const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

describe('When there are blogs in the database', () => {

  beforeEach(async () => {
    await resource.initUsers(api)
    await resource.login(api)
    await resource.initBlogs(api)
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
    title: 'blog3',
    author: 'blogger3',
    url: 'blog.3.example',
    likes: 0
  }

  beforeEach(async () => {
    await resource.initUsers(api)
    await resource.login(api)
    await resource.initBlogs(api)
  })

  test('amount of blogs should increase with valid token', async () => {
    await api.post('/api/blogs')
      .set({ 'authorization': `Bearer ${resource.userToken}` })
      .send(newBlog)
      .expect(201)

    expect(await resource.getBlogs()).toHaveLength(resource.initialBlogs.length + 1)
  })

  test('database should contain added blog', async () => {
    await api.post('/api/blogs')
      .set({ 'authorization': `Bearer ${resource.userToken}` })
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
      .set({ 'authorization': `Bearer ${resource.userToken}` })
      .send({ title: 'blog', author: 'blogger', url: 'blog.example' })

    expect(response.body.likes).toEqual(0)
  })

  test('returns 400 Bad Request when title and url are missing', async () => {
    await api.post('/api/blogs')
      .set({ 'authorization': `Bearer ${resource.userToken}` })
      .send({ author: 'blogger' })
      .expect(400)
  })

  test('returns 401 Unauthorized on invalid token', async () => {
    await api.post('/api/blogs')
      .set({ 'authorization': 'Bearer invalidtoken' })
      .send(newBlog)
      .expect(401)
  })

})

describe('When deleting a blog', () => {

  beforeEach(async () => {
    await resource.initUsers(api, [resource.initialUsersPasswords[0]])
    await resource.login(api)
    await resource.initBlogs(api, [resource.initialBlogs[0]])
  })

  test('amount of blogs should decrease', async () => {
    let blogs = await resource.getBlogs()

    await api.delete(`/api/blogs/${blogs[0].id}`)
      .set({ 'authorization': `Bearer ${resource.userToken}` })
      .expect(204)

    expect(await resource.getBlogs()).toHaveLength(0)
  })

  test('database should not contain deleted blog', async () => {
    let blogs = await resource.getBlogs()

    await api.delete(`/api/blogs/${blogs[0].id}`)
      .set({ 'authorization': `Bearer ${resource.userToken}` })

    expect(await resource.getBlogs()).not.toContainEqual(blogs[0])
  })

  test('blog is not deleted with invalid token', async () => {
    let blogs = await resource.getBlogs()

    await api.delete(`/api/blogs/${blogs[0].id}`)
      .set({ 'authorization': 'Bearer invalidToken' })
      .expect(401)

    expect((await resource.getBlogs())[0]).toBeDefined()
    expect((await resource.getBlogs())[0].id).toEqual(blogs[0].id)
  })

  test('blog is not deleted with invalid login', async () => {
    await resource.login(api, { username: 'wronguser', password: 'differentpass' })
    let blogs = await resource.getBlogs()

    await api.delete(`/api/blogs/${blogs[0].id}`)
      .set({ 'authorization': `Bearer ${resource.userToken}` })
      .expect(401)

    expect((await resource.getBlogs())[0]).toBeDefined()
    expect((await resource.getBlogs())[0].id).toEqual(blogs[0].id)
  })
})

describe('When updating a blog', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(resource.initialUsers)
    await Blog.deleteMany({})
    await Blog.insertMany(resource.initialBlogs)
  })

  test('amount of blogs should stay the same', async () => {
    let blogs = await resource.getBlogs()
    blogs[0].url = 'newurl.example'

    await api.put(`/api/blogs/${blogs[0].id}`)
      .send(blogs[0])
      .expect(200)

    expect(await resource.getBlogs()).toHaveLength(resource.initialBlogs.length)
  })

  test('database should contain updated blog', async () => {
    let blogs = await resource.getBlogs()
    blogs[0].url = 'newurl.example'

    await api.put(`/api/blogs/${blogs[0].id}`)
      .send(blogs[0])

    expect(await resource.getBlogs()).toContainEqual(blogs[0])
  })

})

describe('When a blog has an associated user', () => {

  beforeEach(async () => {
    await resource.initUsers(api)
    await resource.login(api)
    await Blog.deleteMany({})
  })

  test('getting a list of blogs includes user data', async () => {
    await api.post('/api/blogs')
      .set({ 'authorization': `Bearer ${resource.userToken}` })
      .send(resource.initialBlogs[0])

    const response = await api.get('/api/blogs')

    const user = response.body[0].user

    expect(user).toBeDefined()
    expect(user.id).toBeDefined()
    expect(user.name).toBeDefined()
    expect(user.username).toBeDefined()
  })

  test('the associated user is the bearer of the supplied token', async () => {
    await resource.login(api, resource.initialUsersPasswords[0])

    await api.post('/api/blogs')
      .set({ 'authorization': `Bearer ${resource.userToken}` })
      .send(resource.initialBlogs[0])

    const response = await api.get('/api/blogs')

    const user = response.body[0].user

    expect(user.username).toEqual(resource.initialUsersPasswords[0].username)
  })

})

afterAll(() => {
  mongoose.connection.close()
})