const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

userRouter.post('/', async (request, response) => {
  const newUser = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(newUser.password, saltRounds)

  const user = new User(
    {
      username: newUser.username,
      name: newUser.name,
      passwordHash: passwordHash
    }
  )

  const createdUser = await user.save()

  response.status(201).json(createdUser)
})


module.exports = userRouter