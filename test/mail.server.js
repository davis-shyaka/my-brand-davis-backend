// Endpoint testing with mocha and chai and chai-http

// Import libraries
const chai = require("chai");
const chaiHttp = require("chai-http");

const should = chai.should();
var mongoose = require("mongoose");

// Import server
var server = require("../server");

// Import Mail Model
var Mail = require("../models/MailModel");
const User = require("../models/UserModel");

// use chaiHttp for making the actual HTTP requests
chai.use(chaiHttp);
describe("My Brand : Mail Unit", () => {
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
    var newMail = new Mail({
      name: "Testing with Mocha",
      email: "mail@email.com",
      subject: "Well, either this works",
      body: "Well, either this works, or I am in trouble.",
    });
    newMail.save(function (err) {
      done();
    });
  });

  afterEach(function (done) {
    Mail.collection
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

  it("should list ALL Mail on /mail/all GET", function (done) {
    chai
      .request(server)
      .get("/mail/all")
      .end(function (err, res) {
        if (err) done(err);
        else {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("array");
          res.body[0].should.have.property("name");
          res.body[0].should.have.property("email");
          res.body[0].should.have.property("subject");
          res.body[0].should.have.property("body");
          res.body[0].should.have.property("_id");
          done();
        }
      });
  });
  it("should list ONE Message on /mail/get GET", function (done) {
    chai
      .request(server)
      .get("/mail/all")
      .end(function (err, res) {
        chai
          .request(server)
          .get("/mail/get/" + res.body[0]._id)
          .end((error, response) => {
            if (error) done(error);
            else {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a("object");
              response.body.should.have.property("name");
              response.body.should.have.property("email");
              response.body.should.have.property("subject");
              response.body.should.have.property("body");
              response.body.should.have.property("_id");
              done();
            }
          });
      });
  });

  it("should add a Mail on /mail/create POST", function (done) {
    chai
      .request(server)
      .post("/mail/create")
      .send({
        name: "Test Name",
        email: "mail@email.com",
        subject: "Test Subject",
        body: "Test Body. Keep in mind to make me at least 10 characters long.",
      })
      .end(function (err, res) {
        // the res object should have a status of 201
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("name");
        res.body.should.have.property("email");
        res.body.should.have.property("subject");
        res.body.should.have.property("body");
        res.body.should.have.property("_id");
        res.body.name.should.equal("Test Name");
        res.body.email.should.equal("mail@email.com");
        res.body.subject.should.equal("Test Subject");
        res.body.body.should.equal(
          "Test Body. Keep in mind to make me at least 10 characters long."
        );
        done();
      });
  });

  it("should delete a Message on /mail/delete/<id> DELETE with AUTH Token", function (done) {
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
            .get("/mail/all")
            .end(function (err, res) {
              chai
                .request(server)
                .delete("/mail/delete/" + res.body[0]._id)
                .set("Authorization", "JWT " + token)
                .end(function (error, response) {
                  response.should.have.status(200);
                  response.body.should.have.property("message");
                  response.body.message.should.equal(
                    "Mail successfully deleted"
                  );
                  done();
                });
            });
        }
      });
  });
});
