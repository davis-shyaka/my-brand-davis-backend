// Endpoint testing with mocha and chai and chai-http

// Import libraries
const chai = require("chai");
const chaiHttp = require("chai-http");

const should = chai.should();
var mongoose = require("mongoose");

// Import server
var server = require("../server");

// Import Post Model
var Post = require("../models/PostModel");

// use chaiHttp for making the actual HTTP requests
chai.use(chaiHttp);
describe("My Brand : Post Unit", () => {
  beforeEach((done) => {
    var newPost = new Post({
      title: "Testing with Mocha",
      caption: "This is interesting",
      content: "Well, either this works, or I am in trouble",
    });
    newPost.save(function (err) {
      done();
    });
  });

  afterEach(function (done) {
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

  it("should list ALL posts on /post/all GET", function (done) {
    chai
      .request(server)
      .get("/post/all")
      .end(function (err, res) {
        if (err) done(err);
        else {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("array");
          res.body[0].should.have.property("title");
          res.body[0].should.have.property("caption");
          res.body[0].should.have.property("content");
          res.body[0].should.have.property("_id");
          done();
        }
      });
  });
  it("should list ONE post on /post/get GET", function (done) {
    chai
      .request(server)
      .get("/post/all")
      .end(function (err, res) {
        chai
          .request(server)
          .get("/post/get/" + res.body[0]._id)
          .end((error, response) => {
            if (error) done(error);
            else {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a("object");
              response.body.should.have.property("title");
              response.body.should.have.property("caption");
              response.body.should.have.property("content");
              response.body.should.have.property("_id");
              done();
            }
          });
      });
  });

  it("should add a post on /post/create POST", function (done) {
    chai
      .request(server)
      .post("/post/create")
      .send({
        title: "Test Title",
        caption: "Test Caption",
        content: "Test Content",
      })
      .end(function (err, res) {
        // the res object should have a status of 201
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("title");
        res.body.should.have.property("caption");
        res.body.should.have.property("content");
        res.body.should.have.property("_id");
        res.body.title.should.equal("Test Title");
        res.body.caption.should.equal("Test Caption");
        res.body.content.should.equal("Test Content");
        done();
      });
  });

  it("should update a Post on /post/update/<id> PATCH", function (done) {
    chai
      .request(server)
      .get("/post/all")
      .end(function (err, res) {
        chai
          .request(server)
          .patch("/post/update/" + res.body[0]._id)
          .send({
            title: "Testing with Chai - Update",
            caption: "Testing caption",
            content: "Testing content",
          })
          // when we get a response from the endpoint
          // in other words,
          .end(function (error, response) {
            // the res object should have a status of 200
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a("object");
            response.body.should.have.property("title");
            response.body.should.have.property("caption");
            response.body.should.have.property("content");
            response.body.should.have.property("_id");
            response.body.title.should.equal("Testing with Chai - Update");
            response.body.caption.should.equal("Testing caption");
            response.body.content.should.equal("Testing content");
            done();
          });
      });
  });
  it("should delete a Post on /post/delete/<id> DELETE without Auth Token", function (done) {
    chai
      .request(server)
      .get("/post/all")
      .end(function (err, res) {
        chai
          .request(server)
          .delete("/post/delete/" + res.body[0]._id)
          .end(function (error, response) {
            response.should.have.status(200);
            response.body.should.have.property("message");
            response.body.message.should.equal("Post successfully deleted");
            done();
          });
      });
  });
});
