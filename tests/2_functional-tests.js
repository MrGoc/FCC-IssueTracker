const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/testproj")
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
      .post("/api/issues/testproj")
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
      .post("/api/issues/testproj")
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
    /*
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/testproj")
      .type("form")
      .send({
        issue_title: "testproj_title_3",
        created_by: "test_user_3",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });*/
  });
});
