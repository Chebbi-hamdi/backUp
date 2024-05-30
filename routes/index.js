const express = require('express')
const authRouter = require('./public/authRouter')
const usersRouter = require("./users/usersRouter")
let router = express.Router()

router.use('/public/auth', authRouter)
router.use('/users/', usersRouter)

module.exports = router