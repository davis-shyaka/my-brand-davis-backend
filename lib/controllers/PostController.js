import Post from '../models/PostModel.js'

/**
 * @swagger
 * /api/post/all:
 *    get:
 *      tags: [post routes]
 *      description: Returns all posts from our database
 *      responses:
 *        200:
 *          description: Get all posts from our API
 */
const allPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    res.status(200).json(posts)
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

/**
 * @swagger
 * /api/post/get/{postId}:
 *    get:
 *      tags: [post routes]
 *      summary: returns a one post should provide postId from our database
 *      parameters:
 *        - name: postId
 *          in: path
 *          description: provide postId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/post'
 *        404:
 *          description: not found
 */
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

/**
 * @swagger
 * /api/post/create/:
 *   post:
 *     summary: Create a new post
 *     tags: [post routes]
 *     requestBody:
 *       description: please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     responses:
 *       '201':
 *         description: Created
 */
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

/**
 * @swagger
 * /api//post/update/{postId}:
 *   put:
 *     summary: Update a post only by admin
 *     tags: [post routes]
 *     parameters:
 *      - name: postId
 *        in: path
 *        description: provide postId
 *        required: true
 *     requestBody:
 *       description: please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     responses:
 *       '201':
 *         description: Created successfully
 */

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

/**
 * @swagger
 * /api/post/delete/{postId}:
 *    delete:
 *      tags: [post routes]
 *      summary: deleting one post
 *      parameters:
 *        - name: postId
 *          in: path
 *          description: provide postId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/post'
 *        404:
 *          description: not found
 */

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
