/// Endpoint testing with mocha and chai and chai-http

// Import libraries
import chai from 'chai'
import chaiHttp from 'chai-http'

const should = chai.should()
import mongoose from 'mongoose'

// Import server
import server from '../lib/server.js'

// Import User Model
import User from '../lib/models/userModel.js'

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
    var newUser = new User({
      surname: 'SHYAKA',
      givenName: 'Davis',
      email: 'davis@gmail.com',
      password: 'Password!23',
      confirm_password: 'Password!123'
    })
    newUser.save(function (err) {
      done()
    })
  })

  afterEach(function (done) {
    User.collection
      .drop()
      .then(function () {
        // success
      })
      .catch(function () {
        // error handling
        console.warn('Collection may not exist!')
      })
    done()
  })

  it('should list ALL Users on /user/all GET', function (done) {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'admin@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        res.body.should.have.property('token')
        var token = res.body.token
        chai
          .request(server)
          .get('/user/all')
          .set('Authorization', 'JWT ' + token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              res.should.have.status(200)
              res.should.be.json
              res.body.should.be.a('array')
              res.body[0].should.have.property('surname')
              res.body[0].should.have.property('givenName')
              res.body[0].should.have.property('email')
              res.body[0].should.have.property('_id')
              done()
            }
          })
      })
  })

  it('should list ONE User on /user/get GET', function (done) {
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
        res.body.should.have.property('surname')
        res.body.should.have.property('givenName')
        res.body.should.have.property('token')
        var token = res.body.token

        // request to the protected route
        chai
          .request(server)
          .get('/user/all')
          .set('Authorization', 'JWT ' + token)
          .end(function (err, res) {
            chai
              .request(server)
              .get('/user/get/' + res.body[0]._id)
              .set('Authorization', 'JWT ' + token)
              .end((error, response) => {
                if (error) done(error)
                else {
                  response.should.have.status(200)
                  response.should.be.json
                  response.body.should.be.a('object')
                  response.body.should.have.property('surname')
                  response.body.should.have.property('givenName')
                  response.body.should.have.property('email')
                  response.body.should.have.property('_id')
                  done()
                }
              })
          })
      })
  })

  it('should add a User on /user/sign_up POST', function (done) {
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
      .end(function (err, res) {
        // the res object should have a status of 201
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.have.property('surname')
        res.body.should.have.property('givenName')
        res.body.should.have.property('email')
        res.body.should.have.property('password')
        res.body.should.have.property('_id')
        res.body.surname.should.equal('SHYAKA')
        res.body.givenName.should.equal('Davis')
        res.body.email.should.equal('shyaka@gmail.com')
        done()
      })
  })

  it('should login a user on /user/log_in POST', function (done) {
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
          res.body.should.have.property('surname')
          res.body.should.have.property('givenName')
          res.body.should.have.property('email')
          res.body.should.have.property('token')
          done()
        }
      })
  })

  it('should delete a user on /user/delete/<id> DELETE with AUTH Token', function (done) {
    chai
      .request(server)
      .post('/user/log_in')
      // send user login details
      .send({
        email: 'admin@gmail.com',
        password: 'Password!23'
      })
      .end((err, res) => {
        res.body.should.have.property('token')
        var token = res.body.token
        chai
          .request(server)
          .get('/user/all')
          .set('Authorization', 'JWT ' + token)
          .end(function (err, res) {
            chai
              .request(server)
              .delete('/user/delete/' + res.body[0]._id)
              .set('Authorization', 'JWT ' + token)
              .end((error, response) => {
                if (error) done(error)
                else {
                  response.should.have.status(200)
                  response.body.should.have.property('message')
                  response.body.message.should.equal(
                    'User successfully deleted'
                  )
                  done()
                }
              })
          })
      })
  })
})
