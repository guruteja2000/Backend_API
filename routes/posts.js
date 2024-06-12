const Router = require("express").Router()
const User = require("../models/User")
const Post = require("../models/Post")

Router.post("/", async (req, res) => {
  const newPost = new Post(req.body)
  try {
    const savedPost = await newPost.save()
    res.status(200).json(savedPost)
  } catch (err) {
    res.status(500).status(err)
  }
})

Router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.username === req.body.username) {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      )
      res.status(200).json(updatedPost)
    } else {
      res.status(401).json("update only Your Post")
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

Router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.username === req.body.username) {
      await post.delete()
      res.status(200).json("Post has been deleted...")
    } else {
      res.status(401).json("Delete only Your Post")
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

Router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.status(200).json(post)
  } catch (err) {
    res.status(500).json(err)
  }
})

Router.get("/", async (req, res) => {
  const username = req.query.username
  const cat = req.query.cat
  try {
    let Posts
    if (username) {
      Posts = await Post.find({ username: username })
    } else if (cat) {
      Posts = await Post.find({ categories: { $in: [cat] } })
    } else {
      Posts = await Post.find()
    }
    res.status(200).json(Posts)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = Router
