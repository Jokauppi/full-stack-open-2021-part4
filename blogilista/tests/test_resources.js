const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "blog1",
    author: "blogger1",
    url: "blog.1.example",
    likes: 7
  },
  {
    title: "blog2",
    author: "blogger2",
    url: "blog.2.example",
    likes: 8
  }
]

module.exports = {
  initialBlogs
}