import Post from '../models/postModel.js'

const allPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    res.status(200).json({ statusCode: 200, success: true, data: [...posts] })
  } catch (error) {
    res.json({ success: false, data: [{ message: error.message }] })
  }
}

const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })
    if (!post) {
      res.status(404).send({
        statusCode: 404,
        success: false,
        data: [{ message: "Post doesn't exist!" }]
      })
    } else {
      res.status(200).json({ statusCode: 200, success: true, data: [post] })
    }
  } catch (error) {
    res.send({ success: false, data: [{ message: "Post doesn't exist!" }] })
  }
}

const createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body)
    await newPost.save()
    res.status(201).json({ statusCode: 201, success: true, data: [newPost] })
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [{ message: `Error creating post: ${error.message}` }]
    })
  }
}

const updatePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true
    })
    if (!post) {
      res.status(404).send({
        statusCode: 404,
        success: false,
        data: [{ message: "Post doesn't exist!" }]
      })
    } else {
      await post.save()
      res.status(200).json({ statusCode: 200, success: true, data: [post] })
    }
  } catch (error) {
    res.status(404)
    res.json({
      statusCode: 404,
      success: false,
      data: [{ message: "Post doesn't exist!" }]
    })
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })
    if (!post) {
      res.status(404).json({
        statusCode: 404,
        success: false,
        data: [{ message: "Post doesn't exist!" }]
      })
    } else {
      await post.deleteOne()
      res.status(200).json({
        statusCode: 200,
        success: true,
        data: [{ message: 'Post successfully deleted', body: post }]
      })
    }
  } catch (error) {
    res.status(404).json({
      statusCode: 404,
      success: false,
      data: [{ message: error.message }]
    })
  }
}

export default { allPosts, getPost, createPost, updatePost, deletePost }
