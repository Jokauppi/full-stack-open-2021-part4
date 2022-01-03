const mongoose = require('mongoose')
const resource = require('./test_resources')

const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')

describe('When creating a user', () => {

  const newUser = {
    username: "newuser",
    password: "password",
    name: "User New"
  }

  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(resource.initialUsers)
  })
  
  test('right status code and data in the right type is returned', async () => {
    await api.post('/api/users')
    .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('the created user is returned', async () => {
    let response = await api.post('/api/users').send(newUser)
    
    let addedUser = response.body
    
    expect(addedUser.username === newUser.username &&
      addedUser.name === newUser.name
      ).toBe(true)
    })
    
  test('the amount of users grows', async () => {
    await api.post('/api/users').send(newUser)

    expect(await resource.getUsers()).toHaveLength(resource.initialUsers.length + 1)
  })

  test('the database contains the created user', async () => {
    await api.post('/api/users').send(newUser)

    expect((await resource.getUsers()).some(user =>
      user.username === newUser.username &&
      user.name === newUser.name
    )).toBe(true)
  })

})

describe('When database contains users', () => {

    beforeEach(async () => {
      await User.deleteMany({})
      await User.insertMany(resource.initialUsers)
    })
  
    test('getting users returns right status code and data in the right type', async () => {
      await api.get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('getting users returns right amount of users', async () => {
      let response = await api.get('/api/users')
  
      expect(response.body).toHaveLength(resource.initialUsers.length)
    })

    test('getting users returns correct data', async () => {
      let response = await api.get('/api/users')
      
      mapUsers = userArray => userArray.map(user => ({username: user.username, name: user.name}))

      let users = mapUsers(response.body) 
      let expectedUsers = mapUsers(resource.initialUsers)

      expect(users).toEqual(expect.arrayContaining(expectedUsers))
    })
  
  })

  afterAll(() => {
    mongoose.connection.close()
  })