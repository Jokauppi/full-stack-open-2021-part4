const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	const likesSum = (prev, current) => prev + current.likes
	return blogs.reduce(likesSum, 0)
}

module.exports = {
	dummy,
	totalLikes
}