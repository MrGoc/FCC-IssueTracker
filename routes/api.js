"use strict";

const issues = require("./../models/issues.js");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      let issueRes = issues.getIssues(
        project,
        req.query._id,
        req.query.issue_title,
        req.query.issue_text,
        req.query.created_on,
        req.query.updated_on,
        req.query.created_by,
        req.query.assigned_to,
        req.query.open,
        req.query.status_text
      );
      issueRes.then((docs) => {
        let issueArr = [];
        docs.forEach((issue) => {
          issueArr.push(issues.convertIssue(issue));
        });
        res.send(issueArr);
      });
    })

    .post(function (req, res) {
      if (
        req.body.issue_title === undefined ||
        req.body.issue_title === "" ||
        req.body.issue_text === undefined ||
        req.body.issue_text === "" ||
        req.body.created_by === undefined ||
        req.body.created_by === ""
      )
        res.send({ error: "required field(s) missing" });
      else {
        let project = req.params.project;
        let issue = issues.createIssue(
          project,
          req.body.issue_title,
          req.body.issue_text,
          req.body.created_by,
          req.body.assigned_to,
          req.body.status_text
        );
        res.send(issue);
      }
    })

    .put(function (req, res) {
      if (req.body._id === undefined || req.body._id === "")
        res.send({ error: "missing _id" });
      else if (req.params.project === undefined || req.params.project === "")
        res.send({ error: "no update field(s) sent", _id: req.body._id });
      else {
        let project = req.params.project;
        issues.Issue.findOneAndUpdate(
          { project: project, _id: req.body._id, updated_on: Date.now() },
          { open: false },
          { new: true }
        )
          .then((issue) => {
            res.send({ result: "successfully updated", _id: issue._id });
          })
          .catch((err) => {
            res.send({ error: "could not update", _id: req.body._id });
          });
      }
    })

    .delete(function (req, res) {
      if (req.body._id === undefined || req.body._id === "")
        res.send({ error: "missing _id" });
      else {
        let project = req.params.project;
        issues.Issue.deleteOne({ project: project, _id: req.body._id })
          .then((iss) => {
            res.send({ result: "successfully deleted", _id: req.body._id });
          })
          .catch((err) => {
            res.send({ error: "could not delete", _id: req.body._id });
          });
      }
    });
};
