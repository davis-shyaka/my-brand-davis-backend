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
const User = require("../models/UserModel");

// use chaiHttp for making the actual HTTP requests
chai.use(chaiHttp);
describe("My Brand : Post Unit", () => {
  before((done) => {
    const newUser = new User({
      surname: "SHYAKA",
      givenName: "Davis",
      email: "davis@gmail.com",
      password: "Password!23",
      confirm_password: "Password!23",
      isAdmin: true,
    });
    newUser.save((err, user) => {
      done();
    });
  });
  beforeEach((done) => {
    var newPost = new Post({
      title: "Testing with Mocha",
      caption: "This is interesting",
      content:
        "Well, either this works, or I am in trouble. This needs to be at least 30 characters long. Don't remember why I chose this. I must be tripping.",
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
      .post("/user/log_in")
      // send user login details
      .send({
        email: "davis@gmail.com",
        password: "Password!23",
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
          done(err);
        } else {
          // console.log("this runs the login part");
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("surname");
          res.body.should.have.property("givenName");
          res.body.should.have.property("email");
          res.body.should.have.property("token");
          var token = res.body.token;
          chai
            .request(server)
            .post("/post/create")
            .send({
              title: "Test Title",
              caption: "Test Caption",
              content:
                "Well, either this works, or I am in trouble. This needs to be at least 30 characters long. Don't remember why I chose this. I must be tripping.",
            })
            .set("Authorization", "JWT " + token)
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
              res.body.content.should.equal(
                "Well, either this works, or I am in trouble. This needs to be at least 30 characters long. Don't remember why I chose this. I must be tripping."
              );
              done();
            });
        }
      });
  });

  it("should update a Post on /post/update/<id> PATCH with AUTH Token", function (done) {
    chai
      .request(server)
      .post("/user/log_in")
      // send user login details
      .send({
        email: "davis@gmail.com",
        password: "Password!23",
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
          done(err);
        } else {
          // console.log("this runs the login part");
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("surname");
          res.body.should.have.property("givenName");
          res.body.should.have.property("email");
          res.body.should.have.property("token");
          var token = res.body.token;
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
                  content:
                    "Testing content. Well, either this works, or I am in trouble. This needs to be at least 30 characters long. Don't remember why I chose this. I must be tripping.",
                })
                .set("Authorization", "JWT " + token)
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
                  response.body.title.should.equal(
                    "Testing with Chai - Update"
                  );
                  response.body.caption.should.equal("Testing caption");
                  response.body.content.should.equal(
                    "Testing content. Well, either this works, or I am in trouble. This needs to be at least 30 characters long. Don't remember why I chose this. I must be tripping."
                  );
                  done();
                });
            });
        }
      });
  });
  it("should delete a Post on /post/delete/<id> DELETE without AUTH Token", function (done) {
    chai
      .request(server)
      .post("/user/log_in")
      // send user login details
      .send({
        email: "davis@gmail.com",
        password: "Password!23",
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
          done(err);
        } else {
          // console.log("this runs the login part");
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("surname");
          res.body.should.have.property("givenName");
          res.body.should.have.property("email");
          res.body.should.have.property("token");
          var token = res.body.token;
          chai
            .request(server)
            .get("/post/all")
            .end(function (err, res) {
              chai
                .request(server)
                .delete("/post/delete/" + res.body[0]._id)
                .set("Authorization", "JWT " + token)
                .end(function (error, response) {
                  response.should.have.status(200);
                  response.body.should.have.property("message");
                  response.body.message.should.equal(
                    "Post successfully deleted"
                  );
                  done();
                });
            });
        }
      });
  });
});
