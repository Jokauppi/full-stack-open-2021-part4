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
        console.log(response);
        expect(response.body).toHaveLength(resource.initialBlogs.length)
    })

    test('returned blogs have attribute id', async () => {
        let response = await api.get('/api/blogs')

        expect(response.body[0].id).toBeDefined()
    })

})

afterAll(() => {
    mongoose.connection.close()
  })