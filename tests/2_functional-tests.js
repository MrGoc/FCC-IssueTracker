const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const issues = require("./../models/issues.js");

chai.use(chaiHttp);
let idToUpdate;

suite("Functional Tests", function () {
  suiteSetup(async () => {
    await issues.Issue.deleteMany({ project: "TestProject" });
  });

  test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/TestProject")
      .type("form")
      .send({
        issue_title: "testproj_title",
        issue_text: "testproj_text",
        created_on: "2023-04-01T05:25:07.549Z",
        updated_on: "2023-04-02T23:25:11.243Z",
        created_by: "test_user",
        assigned_to: "test_user2",
        open: false,
        status_text: "test_status_text",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "testproj_title");
        assert.equal(res.body.issue_text, "testproj_text");
        assert.equal(res.body.created_on, "2023-04-01T05:25:07.549Z");
        assert.equal(res.body.updated_on, "2023-04-02T23:25:11.243Z");
        assert.equal(res.body.created_by, "test_user");
        assert.equal(res.body.assigned_to, "test_user2");
        assert.equal(res.body.open, false);
        assert.equal(res.body.status_text, "test_status_text");
        done();
      });
  });

  test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/TestProject")
      .type("form")
      .send({
        issue_title: "testproj_title_2",
        issue_text: "testproj_text_2",
        created_by: "test_user_2",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "testproj_title_2");
        assert.equal(res.body.issue_text, "testproj_text_2");
        assert.equal(res.body.created_by, "test_user_2");
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.open, true);
        assert.equal(res.body.status_text, "");
        done();
      });
  });

  test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/TestProject")
      .type("form")
      .send({
        issue_title: "testproj_title_3",
        created_by: "test_user_3",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });

  test("View issues on a project: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/TestProject")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 2);

        assert.equal(res.body[0].issue_title, "testproj_title");
        assert.equal(res.body[0].issue_text, "testproj_text");
        assert.equal(res.body[0].created_on, "2023-04-01T05:25:07.549Z");
        assert.equal(res.body[0].updated_on, "2023-04-02T23:25:11.243Z");
        assert.equal(res.body[0].created_by, "test_user");
        assert.equal(res.body[0].assigned_to, "test_user2");
        assert.equal(res.body[0].open, false);
        assert.equal(res.body[0].status_text, "test_status_text");

        assert.equal(res.body[1].issue_title, "testproj_title_2");
        assert.equal(res.body[1].issue_text, "testproj_text_2");
        assert.equal(res.body[1].created_by, "test_user_2");
        assert.equal(res.body[1].assigned_to, "");
        assert.equal(res.body[1].open, true);
        assert.equal(res.body[1].status_text, "");
        done();
      });
  });
  test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/TestProject")
      .query({ created_by: "test_user_2" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].issue_title, "testproj_title_2");
        assert.equal(res.body[0].issue_text, "testproj_text_2");
        assert.equal(res.body[0].created_by, "test_user_2");
        assert.equal(res.body[0].assigned_to, "");
        assert.equal(res.body[0].open, true);
        assert.equal(res.body[0].status_text, "");
        done();
      });
  });

  test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/TestProject")
      .query({
        created_by: "test_user_2",
        issue_text: "testproj_text_2",
        open: true,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].issue_title, "testproj_title_2");
        assert.equal(res.body[0].issue_text, "testproj_text_2");
        assert.equal(res.body[0].created_by, "test_user_2");
        assert.equal(res.body[0].assigned_to, "");
        assert.equal(res.body[0].open, true);
        assert.equal(res.body[0].status_text, "");
        idToUpdate = res.body[0]._id;
        done();
      });
  });

  test("Update one field", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/TestProject")
      .type("form")
      .send({
        _id: idToUpdate,
        assigned_to: "test_user2",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, idToUpdate);
        done();
      });
  });

  test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/TestProject")
      .type("form")
      .send({
        _id: idToUpdate,
        assigned_to: "test_user33",
        status_text: "test",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, idToUpdate);
        done();
      });
  });

  test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/TestProject")
      .type("form")
      .send({
        assigned_to: "test_user34",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });

  test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/TestProject")
      .type("form")
      .send({
        _id: idToUpdate,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "no update field(s) sent");
        assert.equal(res.body._id, idToUpdate);
        done();
      });
  });

  test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/TestProject")
      .type("form")
      .send({
        _id: "5e0af1c63b6482125c1b42cb",
        assigned_to: "test_user34",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not update");
        assert.equal(res.body._id, "5e0af1c63b6482125c1b42cb");
        done();
      });
  });

  test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/TestProject")
      .type("form")
      .send({
        _id: idToUpdate,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, idToUpdate);
        done();
      });
  });

  test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/TestProject")
      .type("form")
      .send({
        _id: "5e0af1c63b6482125c1b42cb",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not delete");
        assert.equal(res.body._id, "5e0af1c63b6482125c1b42cb");
        done();
      });
  });

  test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/TestProject")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});
