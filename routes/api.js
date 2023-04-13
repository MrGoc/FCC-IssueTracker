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
    })

    .put(function (req, res) {
      let project = req.params.project;
      issues.Issue.findOneAndUpdate(
        { project: project, _id: req.body._id },
        { open: false },
        { new: true }
      ).then((issue) => {
        res.send(issues.convertIssue(issue));
      });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      issues.Issue.deleteOne({ project: project, _id: req.body._id }).then(
        (iss) => {
          res.send(iss.deletedCount.toString());
        }
      );
    });
};
