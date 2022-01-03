const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'blog1',
    author: 'blogger1',
    url: 'blog.1.example',
    likes: 7
  },
  {
    title: 'blog2',
    author: 'blogger2',
    url: 'blog.2.example',
    likes: 8
  }
]

const initialUsers = [
  {
    username: 'user1',
    passwordHash: '$2b$10$O8xQ2cScsBwkV58rRE8CxujENzUexwtmACpMn5YUw7y0rnmKN2o8i',
    name: 'User One'
  },
  {
    username: 'user2',
    passwordHash: '$2b$10$I/tyTMAQHXebxyMBAjl4V.2AV7u9vOdXJicR/4UAQ.vzjBEsx.j8q',
    name: 'User Two'
  }
]

const getBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const getUsers = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  getBlogs,
  getUsers
}