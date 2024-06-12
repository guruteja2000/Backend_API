const Router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const Post = require("../models/Post")

Router.put("/:id", async (req, res) => {
  if (req.params.id === req.body.userId) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.param.id,
        {
          $set: req.body,
        },
        { new: true }
      )
      res.status(200).json(updatedUser)
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    res.status(401).json("You can Update your Profile only")
  }
})

Router.delete("/:id", async (req, res) => {
  if (req.body.id === req.params.id) {
    try {
      const user = await User.findById(req.params.id)
      await Post.deleteMany({ username: user.username })
      await User.findByIdAndDelete(req.body.id)
      res.status(200).json("User has been Deleted")
    } catch (err) {
      res.status(500).json("Something went Wrong")
    }
  } else {
    res.status(401).json("You can delete other Profile only")
  }
})

Router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...others } = user._doc
    res.status(200).json(others)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = Router
