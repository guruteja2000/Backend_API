const Router = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../models/User")

Router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)
    const userDoc = new User({
      username: req.body.username,
      email: req.body.email,
      password: password,
    })
    const user = await userDoc.save()
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
})

Router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })

    !user && res.status(500).json("UserName is Wrong")

    const pass = await bcrypt.compare(req.body.password, user.password)

    !pass && res.status(500).json("Password is Wrong")

    const { password, ...others } = user._doc
    res.status(200).json(others)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = Router
