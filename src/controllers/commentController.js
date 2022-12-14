import Comment from '../models/commentModel.js'
import Post from '../models/postModel.js'

// get all comments
const allComments = async (req, res) => {
  try {
    // const comments = await Comment.find();
    // res.json({ success: true, message: "All comments", comments });
    const data = await Comment.find().populate({
      path: 'post user',
      select: 'title surname givenName email'
    })
    res.status(200).json({ statusCode: 200, success: true, data: [...data] })
  } catch (error) {
    res.json({ success: false, data: [{ message: error.message }] })
  }
}

// Get individual comment
const getComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id })
    if (!comment) {
      res.status(404).send({
        statusCode: 404,
        success: false,
        data: [{ message: "Comment doesn't exist!" }]
      })
    } else {
      res.status(200).json({ statusCode: 200, success: true, data: [comment] })
    }
  } catch (error) {
    res.status(404).send({ success: false, data: [{ message: error.message }] })
  }
}

// posting a comment on the blog
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
      // get the comment text and record post id
      const comment = new Comment({
        comment: req.body.comment,
        post: id,
        user: user.id
      })
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
          // save comment
          await comment.save()
          // push the comment into the post.comments array
          postRelated.comments.push(comment)
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
    const comment = await Comment.findOne({ _id: req.params.id })
    if (!comment) {
      res.status(404).send({
        statusCode: 404,
        success: false,
        data: [{ message: "Comment doesn't exist!" }]
      })
    } else {
      await comment.deleteOne()
      res.status(200).json({
        statusCode: 200,
        success: true,
        data: [{ message: 'Comment successfully deleted', body: comment }]
      })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ success: false, data: [{ message: err.message }] })
  }
}

export default { allComments, getComment, createComment, deleteComment }
