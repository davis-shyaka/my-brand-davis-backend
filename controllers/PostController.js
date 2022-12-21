import Post from '../models/postModel.js'

const allPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    res.status(200).json(posts)
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })
    if (!post) {
      res.status(404).send({ success: false, message: "Post doesn't exist!" })
    } else res.status(200).json(post)
  } catch (error) {
    res.status(404).send({ success: false, message: "Post doesn't exist!" })
  }
}

const createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body)
    await newPost.save()
    res.status(201).json(newPost)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error creating post: ${error.message}`
    })
  }
}

const updatePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true
    })
    if (!post) {
      res.status(404).send({ success: false, message: "Post doesn't exist!" })
    } else {
      await post.save()
      res.status(200).json(post)
    }
  } catch (error) {
    res.status(404)
    res.json({ success: false, message: "Post doesn't exist!" })
    console.log('Error updating post: ', error.message)
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })
    if (!post) {
      res.status(404).json({ success: false, message: "Post doesn't exist!" })
    } else {
      await post.deleteOne()
      res
        .status(200)
        .json({ success: true, message: 'Post successfully deleted', post })
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    })
  }
}

export default { allPosts, getPost, createPost, updatePost, deletePost }
