const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {

  const listWithOneBlog = [
    {
      'title': 'example',
      'author': 'blogger',
      'url': 'blog.example',
      'likes': 7,
      'id': '6147da558b976c1408a0e55a'
    }
  ]

  test('of empty list is 0', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog equals the likes of the single blog', () => {
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(7)
  })

  test('of a longer list is correct', () => {
    expect(listHelper.totalLikes(listWithOneBlog.concat(listWithOneBlog))).toBe(14)
  })


})

describe('favorite blog', () => {

  const blogList = [
    {
      'title': 'example1',
      'author': 'blogger1',
      'url': 'blog.example1',
      'likes': 1,
      'id': '1'
    },
    {
      'title': 'example2',
      'author': 'blogger2',
      'url': 'blog.example2',
      'likes': 2,
      'id': '2'
    },
    {
      'title': 'example3',
      'author': 'blogger3',
      'url': 'blog.example3',
      'likes': 3,
      'id': '3'
    }
  ]

  test('should be null when list is empty', () => {
    expect(listHelper.favoriteBlog([])).toEqual(null)
  })

  test('should be the only blog when list has lenght of 1', () => {
    expect(listHelper.favoriteBlog([blogList[0]])).toEqual({
      'title': 'example1',
      'author': 'blogger1',
      'url': 'blog.example1',
      'likes': 1,
      'id': '1'
    })
  })

  test('should be the blog with most likes when list has several blogs', () => {
    expect(listHelper.favoriteBlog(blogList)).toEqual({
      'title': 'example3',
      'author': 'blogger3',
      'url': 'blog.example3',
      'likes': 3,
      'id': '3'
    })
  })

})

describe('Most blogs', () => {

  const blogList = [
    {
      'title': 'example1',
      'author': 'blogger1',
      'url': 'blog.example1',
      'likes': 1,
      'id': '1'
    },
    {
      'title': 'example2',
      'author': 'blogger1',
      'url': 'blog.example2',
      'likes': 2,
      'id': '2'
    },
    {
      'title': 'example3',
      'author': 'blogger3',
      'url': 'blog.example3',
      'likes': 3,
      'id': '3'
    }
  ]

  test('should be by author with most blogs', () => {
    expect(listHelper.mostBlogs(blogList)).toEqual({
      'author': 'blogger1',
      'blogs': 2
    })
  })

  test('should be by the only author when list has 1 blog', () => {
    expect(listHelper.mostBlogs([blogList[0]])).toEqual({
      'author': 'blogger1',
      'blogs': 1
    })
  })

  test('should be null when list is empty', () => {
    expect(listHelper.mostBlogs([])).toBe(null)
  })

})

describe('Most liked author', () => {

  const blogList = [
    {
      'title': 'example1',
      'author': 'blogger1',
      'url': 'blog.example1',
      'likes': 2,
      'id': '1'
    },
    {
      'title': 'example2',
      'author': 'blogger1',
      'url': 'blog.example2',
      'likes': 2,
      'id': '2'
    },
    {
      'title': 'example3',
      'author': 'blogger3',
      'url': 'blog.example3',
      'likes': 3,
      'id': '3'
    }
  ]

  test('should be one with most total likes', () => {
    expect(listHelper.mostLikes(blogList)).toEqual({
      'author': 'blogger1',
      'likes': 4
    })
  })

  test('should be one with the most liked blog when authors do not have multiple blogs', () => {
    expect(listHelper.mostLikes(blogList.slice(1,3))).toEqual({
      'author': 'blogger3',
      'likes': 3
    })
  })

  test('should be the only author when list has 1 blog', () => {
    expect(listHelper.mostLikes([blogList[0]])).toEqual({
      'author': 'blogger1',
      'likes': 2
    })
  })

  test('should be null when list is empty', () => {
    expect(listHelper.mostLikes([])).toBe(null)
  })

})


