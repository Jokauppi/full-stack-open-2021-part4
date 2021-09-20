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

	return mostLiked ?? null
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog
}