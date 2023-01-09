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

// comments

// get all comments
const getAllComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    const comments = post.comments
    res
      .status(200)
      .json({ statusCode: 200, success: true, data: [...comments] })
  } catch (error) {
    res.status(500).json({ success: false, data: [{ message: error.message }] })
  }
}
// create a comment
const createComment = async (req, res) => {
  try {
    // find out which post you are commenting
    const id = req.params.id
    // find out which user is commenting
    const user = req.user
    if (!id) {
      res.status(404).json({
        statusCode: 404,
        success: false,
        data: [{ message: 'Must select a post to comment!' }]
      })
    } else if (!user) {
      res.status(405).json({
        statusCode: 405,
        success: false,
        data: [{ message: 'Must be logged in to comment' }]
      })
    } else if (id && user) {
      // handling the actual logic of storing the comment along with the right user and to the right post.
      try {
        // get this particular post
        const postRelated = await Post.findById(id)
        if (!postRelated) {
          res.status(404).json({
            statusCode: 404,
            success: false,
            data: [{ message: "Post doesn't exist!" }]
          })
        } else {
          // push the comment into the post.comments array
          postRelated.comments = [
            ...postRelated?.comments,
            {
              user,
              comment: req.body.comment
            }
          ]
          // save and redirect...
          await postRelated.save()
          res.status(201).json({
            statusCode: 201,
            success: true,
            data: [
              { message: 'Posted comment successfully', body: postRelated }
            ]
          })
        }
      } catch (error) {
        res.status(404).json({
          statusCode: 404,
          success: false,
          data: [
            { message: 'The post you are trying to comment on does not exist' }
          ]
        })
      }
    }
  } catch (error) {
    res.json({ success: false, data: [{ message: error.message }] })
  }
}

// delete a comment
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postID })
    if (!post) {
      res.status(404).send({
        statusCode: 404,
        success: false,
        data: [{ message: "Post doesn't exist!" }]
      })
    } else {
      const comments = post.comments.filter(
        ({ _id }) => _id != req.params.commentID
      )
      post.comments = comments
      await post.save()
      res.status(200).json({
        statusCode: 200,
        success: true,
        data: [{ message: 'Comment successfully deleted', body: post }]
      })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ success: false, data: [{ message: err.message }] })
  }
}

// likes

export default {
  allPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getAllComments,
  createComment,
  deleteComment
}
