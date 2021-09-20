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
