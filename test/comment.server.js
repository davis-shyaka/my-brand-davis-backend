// Endpoint testing with mocha and chai and chai-http

// Import libraries
const chai = require("chai");
const chaiHttp = require("chai-http");

const should = chai.should();
var mongoose = require("mongoose");

// Import server
var server = require("../server");

// Import Comment Model
var Comment = require("../models/CommentModel");
var Post = require("../models/PostModel");
var User = require("../models/UserModel");

// use chaiHttp for making the actual HTTP requests
chai.use(chaiHttp);
describe("My Brand : Comment Unit", () => {
  beforeEach((done) => {
    var newUser = new User({
      surname: "Testing with Chai",
      givenName: "Testing",
      email: "Post content",
      password: "password123",
      confirmPassword: "password123",
    });
    newUser.save((err) => {
      done();
    });
    var newPost = new Post({
      title: "Testing with Chai",
      caption: "Testing",
      content: "Post content",
    });
    newPost.save((err) => {
      done();
    });
  });

  afterEach(function (done) {
    User.collection
      .drop()
      .then(function () {
        // success
      })
      .catch(function () {
        // error handling
        console.warn("Collection may not exist!");
      });
    done();
    Post.collection
      .drop()
      .then(function () {
        // success
      })
      .catch(function () {
        // error handling
        console.warn("Collection may not exist!");
      });
    done();
  });

  it("should list ALL Comments on /comment/all GET", function (done) {
    chai
      .request(server)
      .get("/comment/all")
      .end(function (err, res) {
        if (err) done(err);
        else {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("array");
          res.body[0].should.have.property("name");
          res.body[0].should.have.property("eComment");
          res.body[0].should.have.property("subject");
          res.body[0].should.have.property("body");
          res.body[0].should.have.property("_id");
          done();
        }
      });
  });
  it("should list ONE Message on /comment/get GET", function (done) {
    chai
      .request(server)
      .get("/comment/all")
      .end(function (err, res) {
        chai
          .request(server)
          .get("/comment/get/" + res.body[0]._id)
          .end((error, response) => {
            if (error) done(error);
            else {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a("object");
              response.body.should.have.property("comment");
              response.body.should.have.property("post");
              response.body.should.have.property("user");
              response.body.should.have.property("_id");
              done();
            }
          });
      });
  });

  it("should add a Comment on /comment/create POST", function (done) {
    chai
      .request(server)
      .get("/post/all")
      .end(function (err, res) {
        chai
          .request(server)
          .post("/comment/create/on/post/" + res.body[0]._id)
          .send({
            comment: "Nice post",
          })
          .end(function (error, response) {
            // the response object should have a status of 201
            response.should.have.status(201);
            response.should.be.json;
            response.body.should.be.a("object");
            response.body.should.have.property("comment");
            response.body.should.have.property("post");
            response.body.should.have.property("user");
            response.body.should.have.property("date");
            response.body.should.have.property("_id");
            response.body.comment.should.equal("Nice post");
            done();
          });
      });
  });

  it("should delete a Message on /Comment/delete/<id> DELETE without Auth Token", function (done) {
    chai
      .request(server)
      .get("/comment/all")
      .end(function (err, res) {
        chai
          .request(server)
          .delete("/comment/delete/" + res.body[0]._id)
          .end(function (error, response) {
            response.should.have.status(200);
            response.body.should.have.property("message");
            response.body.message.should.equal("Comment successfully deleted");
            done();
          });
      });
  });
});
