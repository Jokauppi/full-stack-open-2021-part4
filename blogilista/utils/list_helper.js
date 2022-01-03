const _ = require('lodash')

const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	const likesSum = (prev, current) => prev + current.likes
	return blogs.reduce(likesSum, 0)
}

const favoriteBlog = (blogs) => {

	const maxLikes = (previous, current) => {
		if (current.likes > previous) return current.likes
		return previous
	}

	const mostLikes = blogs.reduce(maxLikes, -1)
	const mostLiked = blogs.find(blog => blog.likes === mostLikes)

	if (mostLiked !== null && mostLiked !== undefined) return mostLiked
	
	return null
}

const mostBlogs = (blogs) => {
	const mostBlogsAuthor = _.chain(blogs).countBy('author').toPairs().maxBy(_.last).value()

	try {
		return {
			author: mostBlogsAuthor[0],
			blogs: mostBlogsAuthor[1]
		}
	} catch (error) {
		return null
	}
}

const mostLikes = (blogs) => {
	const mostLikedBlog = _.chain(blogs).groupBy('author')
		.map((blogs, key) => {
			return [key, _.sumBy(blogs, 'likes')]
		})
		.maxBy(_.last)
		.value()

	try {
		return {
			author: mostLikedBlog[0],
			likes: mostLikedBlog[1]
		}
	} catch (error) {
		return null
	}
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}