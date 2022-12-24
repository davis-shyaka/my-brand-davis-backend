/// Endpoint testing with mocha and chai and chai-http

// Import libraries
import chai from 'chai'
import chaiHttp from 'chai-http'

const should = chai.should()
import mongoose from 'mongoose'

// Import server
import server from '../server.js'

// Import User Model
import User from '../src/models/userModel.js'

// use chaiHttp for making the actual HTTP requests
chai.use(chaiHttp)
describe('My Brand : User Unit', () => {
  beforeEach((done) => {
    const newUser = new User({
      surname: 'SHYAKA',
      givenName: 'Davis',
      email: 'admin@gmail.com',
      password: 'Password!23',
      confirm_password: 'Password!23',
      isAdmin: true
    })
    newUser.save((err, user) => {
      done()
    })
  })
  beforeEach((done) => {
    const newUser = new User({
      surname: 'SHYAKA',
      givenName: 'Davis',
      email: 'davis@gmail.com',
      password: 'Password!23',
      confirm_password: 'Password!123'
    })
    newUser.save((err) => {
      done()
    })
  })

  afterEach((done) => {
    User.collection
      .drop()
      .then(() => {
        // success
      })
      .catch(() => {
        // error handling
        console.warn('Collection may not exist!')
      })
    done()
  })

  it('should list ALL Users on /user/all GET', (done) => {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'admin@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('data')
        const token = res.body.data[0].token
        chai
          .request(server)
          .get('/user/all')
          .set('Authorization', 'JWT ' + token)
          .end((err, res) => {
            if (err) done(err)
            else {
              res.should.have.status(200)
              res.should.be.json
              res.body.should.be.a('object')
              res.body.data[0].should.have.property('surname')
              res.body.data[0].should.have.property('givenName')
              res.body.data[0].should.have.property('email')
              res.body.data[0].should.have.property('_id')
              done()
            }
          })
      })
  })

  it('should list ONE User on /user/get GET', (done) => {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'admin@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.data[0].should.have.property('surname')
        res.body.data[0].should.have.property('givenName')
        res.body.data[0].should.have.property('token')
        const token = res.body.data[0].token

        // request to the protected route
        chai
          .request(server)
          .get('/user/all')
          .set('Authorization', 'JWT ' + token)
          .end((err, res) => {
            chai
              .request(server)
              .get('/user/get/' + res.body.data[0]._id)
              .set('Authorization', 'JWT ' + token)
              .end((error, response) => {
                if (error) done(error)
                else {
                  response.should.have.status(200)
                  response.should.be.json
                  response.body.should.be.a('object')
                  response.body.data[0].should.have.property('surname')
                  response.body.data[0].should.have.property('givenName')
                  response.body.data[0].should.have.property('email')
                  response.body.data[0].should.have.property('_id')
                  done()
                }
              })
          })
      })
  })

  it('should add a User on /user/sign_up POST', (done) => {
    chai
      .request(server)
      .post('/user/sign_up')
      .send({
        surname: 'SHYAKA',
        givenName: 'Davis',
        email: 'shyaka@gmail.com',
        password: 'Password!23',
        confirm_password: 'Password!23'
      })
      .end((err, res) => {
        // the res object should have a status of 201
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.data[0].should.have.property('surname')
        res.body.data[0].should.have.property('givenName')
        res.body.data[0].should.have.property('email')
        res.body.data[0].surname.should.equal('SHYAKA')
        res.body.data[0].givenName.should.equal('Davis')
        res.body.data[0].email.should.equal('shyaka@gmail.com')
        done()
      })
  })

  it('should login a user on /user/log_in POST', (done) => {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'davis@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        if (err) done(err)
        else {
          // console.log("this runs the login part");
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.data[0].should.have.property('surname')
          res.body.data[0].should.have.property('givenName')
          res.body.data[0].should.have.property('email')
          res.body.data[0].should.have.property('token')
          done()
        }
      })
  })

  it('should delete a user on /user/delete/<id> DELETE with AUTH Token', (done) => {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'admin@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        res.body.data[0].should.have.property('token')
        const token = res.body.data[0].token
        chai
          .request(server)
          .get('/user/all')
          .set('Authorization', 'JWT ' + token)
          .end((err, res) => {
            chai
              .request(server)
              .delete('/user/delete/' + res.body.data[0]._id)
              .set('Authorization', 'JWT ' + token)
              .end((error, response) => {
                if (error) done(error)
                else {
                  response.should.have.status(200)
                  response.body.data[0].should.have.property('message')
                  response.body.data[0].message.should.equal(
                    'User successfully deleted'
                  )
                  done()
                }
              })
          })
      })
  })
})

// post
// Import Post Model
import Post from '../src/models/postModel.js'

// use chaiHttp for making the actual HTTP requests
chai.use(chaiHttp)
describe('My Brand : Post Unit', () => {
  before((done) => {
    const newUser = new User({
      surname: 'SHYAKA',
      givenName: 'Davis',
      email: 'davis@gmail.com',
      password: 'Password!23',
      confirm_password: 'Password!23',
      isAdmin: true
    })
    newUser.save((err, user) => {
      done()
    })
  })
  beforeEach((done) => {
    const newPost = new Post({
      title: 'Testing with Mocha',
      caption: 'This is interesting',
      content:
        "Well, either this works, or I am in trouble. This needs to be at least 30 characters long. Don't remember why I chose this. I must be tripping."
    })
    newPost.save((err) => {
      done()
    })
  })

  afterEach((done) => {
    Post.collection
      .drop()
      .then(() => {
        // success
      })
      .catch(() => {
        // error handling
        console.warn('Collection may not exist!')
      })
    done()
  })

  it('should list ALL posts on /post/all GET', (done) => {
    chai
      .request(server)
      .get('/post/all')
      .end((err, res) => {
        if (err) done(err)
        else {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.should.have.property('data')
          res.body.data[0].should.have.property('title')
          res.body.data[0].should.have.property('caption')
          res.body.data[0].should.have.property('content')
          res.body.data[0].should.have.property('_id')
          done()
        }
      })
  })
  it('should list ONE post on /post/get GET', (done) => {
    chai
      .request(server)
      .get('/post/all')
      .end((err, res) => {
        chai
          .request(server)
          .get('/post/get/' + res.body.data[0]._id)
          .end((error, response) => {
            if (error) done(error)
            else {
              response.should.have.status(200)
              response.should.be.json
              response.body.should.be.a('object')
              response.body.data[0].should.have.property('title')
              response.body.data[0].should.have.property('caption')
              response.body.data[0].should.have.property('content')
              response.body.data[0].should.have.property('_id')
              done()
            }
          })
      })
  })

  it('should add a post on /post/create POST', (done) => {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'davis@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        if (err) {
          console.log(err)
          done(err)
        } else {
          // console.log("this runs the login part");
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.data[0].should.have.property('surname')
          res.body.data[0].should.have.property('givenName')
          res.body.data[0].should.have.property('email')
          res.body.data[0].should.have.property('token')
          const token = res.body.data[0].token
          chai
            .request(server)
            .post('/post/create')
            .send({
              title: 'Test Title',
              caption: 'Test Caption',
              content:
                "Well, either this works, or I am in trouble. This needs to be at least 30 characters long. Don't remember why I chose this. I must be tripping."
            })
            .set('Authorization', 'JWT ' + token)
            .end((err, res) => {
              // the res object should have a status of 201
              res.should.have.status(201)
              res.should.be.json
              res.body.should.be.a('object')
              res.body.data[0].should.have.property('title')
              res.body.data[0].should.have.property('caption')
              res.body.data[0].should.have.property('content')
              res.body.data[0].should.have.property('_id')
              res.body.data[0].title.should.equal('Test Title')
              res.body.data[0].caption.should.equal('Test Caption')
              res.body.data[0].content.should.equal(
                "Well, either this works, or I am in trouble. This needs to be at least 30 characters long. Don't remember why I chose this. I must be tripping."
              )
              done()
            })
        }
      })
  })

  it('should update a Post on /post/update/<id> PATCH with AUTH Token', (done) => {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'davis@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        if (err) {
          console.log(err)
          done(err)
        } else {
          // console.log("this runs the login part");
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.data[0].should.have.property('surname')
          res.body.data[0].should.have.property('givenName')
          res.body.data[0].should.have.property('email')
          res.body.data[0].should.have.property('token')
          const token = res.body.data[0].token
          chai
            .request(server)
            .get('/post/all')
            .end((err, res) => {
              chai
                .request(server)
                .patch('/post/update/' + res.body.data[0]._id)
                .send({
                  title: 'Testing with Chai - Update',
                  caption: 'Testing caption',
                  content:
                    "Testing content. Well, either this works, or I am in trouble. This needs to be at least 30 characters long. Don't remember why I chose this. I must be tripping."
                })
                .set('Authorization', 'JWT ' + token)
                // when we get a response from the endpoint
                // in other words,
                .end((error, response) => {
                  // the res object should have a status of 200
                  response.should.have.status(200)
                  response.should.be.json
                  response.body.should.be.a('object')
                  response.body.data[0].should.have.property('title')
                  response.body.data[0].should.have.property('caption')
                  response.body.data[0].should.have.property('content')
                  response.body.data[0].should.have.property('_id')
                  response.body.data[0].title.should.equal(
                    'Testing with Chai - Update'
                  )
                  response.body.data[0].caption.should.equal('Testing caption')
                  response.body.data[0].content.should.equal(
                    "Testing content. Well, either this works, or I am in trouble. This needs to be at least 30 characters long. Don't remember why I chose this. I must be tripping."
                  )
                  done()
                })
            })
        }
      })
  })
  it('should delete a Post on /post/delete/<id> DELETE with AUTH Token', (done) => {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'davis@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        if (err) {
          console.log(err)
          done(err)
        } else {
          // console.log("this runs the login part");
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.data[0].should.have.property('surname')
          res.body.data[0].should.have.property('givenName')
          res.body.data[0].should.have.property('email')
          res.body.data[0].should.have.property('token')
          const token = res.body.data[0].token
          chai
            .request(server)
            .get('/post/all')
            .end((err, res) => {
              chai
                .request(server)
                .delete('/post/delete/' + res.body.data[0]._id)
                .set('Authorization', 'JWT ' + token)
                .end((error, response) => {
                  response.should.have.status(200)
                  response.body.data[0].should.have.property('message')
                  response.body.data[0].message.should.equal(
                    'Post successfully deleted'
                  )
                  done()
                })
            })
        }
      })
  })
})

// mail

// Import Mail Model
import Mail from '../src/models/mailModel.js'

// use chaiHttp for making the actual HTTP requests
chai.use(chaiHttp)
describe('My Brand : Mail Unit', () => {
  before((done) => {
    const newUser = new User({
      surname: 'SHYAKA',
      givenName: 'Davis',
      email: 'admin@gmail.com',
      password: 'Password!23',
      confirm_password: 'Password!23',
      isAdmin: true
    })
    newUser.save((err, user) => {
      done()
    })
  })
  beforeEach((done) => {
    const newMail = new Mail({
      name: 'Testing with Mocha',
      email: 'mail@email.com',
      subject: 'Well, either this works',
      message: 'Well, either this works, or I am in trouble.'
    })
    newMail.save((err) => {
      done()
    })
  })

  afterEach((done) => {
    Mail.collection
      .drop()
      .then(() => {
        // success
      })
      .catch(() => {
        // error handling
        console.warn('Collection may not exist!')
      })
    done()
  })

  it('should list ALL Mail on /mail/all GET', (done) => {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'admin@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        res.body.data[0].should.have.property('token')
        const token = res.body.data[0].token
        chai
          .request(server)
          .get('/mail/all')
          .set('Authorization', 'JWT ' + token)
          .end((err, res) => {
            if (err) done(err)
            else {
              res.should.have.status(200)
              res.should.be.json
              res.body.should.be.a('object')
              res.body.data[0].should.have.property('name')
              res.body.data[0].should.have.property('email')
              res.body.data[0].should.have.property('subject')
              res.body.data[0].should.have.property('message')
              res.body.data[0].should.have.property('_id')
              done()
            }
          })
      })
  })
  it('should list ONE Message on /mail/get GET', (done) => {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'admin@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        res.body.data[0].should.have.property('token')
        const token = res.body.data[0].token
        chai
          .request(server)
          .get('/mail/all')
          .set('Authorization', 'JWT ' + token)
          .end((err, res) => {
            chai
              .request(server)
              .get('/mail/get/' + res.body.data[0]._id)
              .set('Authorization', 'JWT ' + token)
              .end((error, response) => {
                if (error) done(error)
                else {
                  response.should.have.status(200)
                  response.should.be.json
                  response.body.should.be.a('object')
                  response.body.data[0].should.have.property('name')
                  response.body.data[0].should.have.property('email')
                  response.body.data[0].should.have.property('subject')
                  response.body.data[0].should.have.property('message')
                  response.body.data[0].should.have.property('_id')
                  done()
                }
              })
          })
      })
  })

  it('should add a Mail on /mail/create POST', (done) => {
    chai
      .request(server)
      .post('/mail/create')
      .send({
        name: 'Test Name',
        email: 'mail@email.com',
        subject: 'Test Subject',
        message:
          'Test Body. Keep in mind to make me at least 10 characters long.'
      })
      .end((err, res) => {
        // the res object should have a status of 201
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.data[0].should.have.property('name')
        res.body.data[0].should.have.property('email')
        res.body.data[0].should.have.property('subject')
        res.body.data[0].should.have.property('message')
        res.body.data[0].should.have.property('_id')
        res.body.data[0].name.should.equal('Test Name')
        res.body.data[0].email.should.equal('mail@email.com')
        res.body.data[0].subject.should.equal('Test Subject')
        res.body.data[0].message.should.equal(
          'Test Body. Keep in mind to make me at least 10 characters long.'
        )
        done()
      })
  })

  it('should delete a Message on /mail/delete/<id> DELETE with AUTH Token', (done) => {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'admin@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        res.body.data[0].should.have.property('token')
        const token = res.body.data[0].token
        chai
          .request(server)
          .get('/mail/all')
          .set('Authorization', 'JWT ' + token)
          .end((err, res) => {
            chai
              .request(server)
              .delete('/mail/delete/' + res.body.data[0]._id)
              .set('Authorization', 'JWT ' + token)
              .end((error, response) => {
                if (error) done(error)
                else {
                  response.should.have.status(200)
                  response.body.data[0].should.have.property('message')
                  response.body.data[0].message.should.equal(
                    'Mail successfully deleted'
                  )
                  done()
                }
              })
          })
      })
  })
})

import Comment from '../src/models/commentModel.js'

// use chaiHttp for making the actual HTTP requests
chai.use(chaiHttp)
describe('My Brand : Comment Unit', () => {
  before((done) => {
    const newUser = new User({
      surname: 'SHYAKA',
      givenName: 'Davis',
      email: 'admin@gmail.com',
      password: 'Password!23',
      confirm_password: 'Password!23',
      isAdmin: true
    })
    newUser.save((err, user) => {
      done()
    })
  })
  beforeEach((done) => {
    const newComment = new Comment({
      comment: 'Testing with Mocha'
    })
    newComment.save((err) => {
      done()
    })
  })

  afterEach((done) => {
    Comment.collection
      .drop()
      .then(() => {
        // success
      })
      .catch(() => {
        // error handling
        console.warn('Collection may not exist!')
      })
    done()
  })

  it('should list ALL Comments on /comment/all GET', (done) => {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'admin@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        res.body.data[0].should.have.property('token')
        const token = res.body.data[0].token
        chai
          .request(server)
          .get('/comment/all')
          .set('Authorization', 'JWT ' + token)
          .end((err, res) => {
            if (err) done(err)
            else {
              res.should.have.status(200)
              res.should.be.json
              res.body.should.be.a('object')
              res.body.data[0].should.have.property('comment')
              res.body.data[0].should.have.property('_id')
              done()
            }
          })
      })
  })
  it('should list ONE Comment on /comment/get GET', (done) => {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'admin@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        res.body.data[0].should.have.property('token')
        const token = res.body.data[0].token
        chai
          .request(server)
          .get('/comment/all')
          .set('Authorization', 'JWT ' + token)
          .end((err, res) => {
            chai
              .request(server)
              .get('/comment/get/' + res.body.data[0]._id)
              .set('Authorization', 'JWT ' + token)
              .end((error, response) => {
                if (error) done(error)
                else {
                  response.should.have.status(200)
                  response.should.be.json
                  response.body.should.be.a('object')
                  response.body.data[0].should.have.property('comment')
                  response.body.data[0].should.have.property('_id')
                  done()
                }
              })
          })
      })
  })

  it('should add a Comment on /comment/create POST', (done) => {
    chai
      .request(server)
      .post('/comment/create/on/post/2')
      .send({
        comment: 'People need people'
      })
      .end((err, res) => {
        // the res object should have a status of 201
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.data[0].should.have.property('comment')
        res.body.data[0].should.have.property('_id')
        res.body.data[0].comment.should.equal('People need people')
        done()
      })
  })

  it('should delete a Comment on /comment/delete/<id> DELETE with AUTH Token', (done) => {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'admin@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        res.body.data[0].should.have.property('token')
        const token = res.body.data[0].token
        chai
          .request(server)
          .get('/comment/all')
          .set('Authorization', 'JWT ' + token)
          .end((err, res) => {
            chai
              .request(server)
              .delete('/comment/delete/' + res.body.data[0]._id)
              .set('Authorization', 'JWT ' + token)
              .end((error, response) => {
                if (error) done(error)
                else {
                  response.should.have.status(200)
                  response.body.data[0].should.have.property('message')
                  response.body.data[0].message.should.equal(
                    'Comment successfully deleted'
                  )
                  done()
                }
              })
          })
      })
  })
})
