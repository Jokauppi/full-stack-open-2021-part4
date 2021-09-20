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
