"use strict";

const issues = require("./../models/issues.js");
const projection = {
  _id: 1,
  assigned_to: 1,
  status_text: 1,
  open: 1,
  issue_title: 1,
  issue_text: 1,
  created_by: 1,
  created_on: 1,
  updated_on: 1,
};

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      let filter = { project: project, ...req.query };
      issues.Issue.find(filter, projection).then((doc) => res.json(doc));
    })

    .post(function (req, res) {
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by)
        res.send({ error: "required field(s) missing" });
      else {
        let project = req.params.project;
        let now = Date.now();
        issues
          .Issue({
            project: project,
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_on: now,
            updated_on: now,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to,
            open: true,
            status_text: req.body.status_text,
          })
          .save()
          .then((issue) =>
            res.json({
              assigned_to: issue.assigned_to,
              status_text: issue.status_text,
              open: issue.open,
              _id: issue._id,
              issue_title: issue.issue_title,
              issue_text: issue.issue_text,
              created_by: issue.created_by,
              created_on: issue.created_on,
              updated_on: issue.updated_on,
            })
          );
      }
    })

    .put(function (req, res) {
      if (!req.body._id) res.send({ error: "missing _id" });
      else if (Object.keys(req.body).length === 0)
        res.send({ error: "no update field(s) sent", _id: req.body._id });
      else {
        let project = req.params.project;
        let myIssue = issues.Issue.findOne(req.body._id);
        if (!myIssue)
          res.send({ error: "could not update", _id: req.body._id });
        else {
          Object.keys(req.body).map((field) => {
            myIssue[field] = req.body[field];
          });
          myIssue.updated_on = Date.now();
          myIssue
            .save()
            .then((issue) =>
              res.send({ result: "successfully updated", _id: issue._id })
            )
            .catch((err) => {
              res.send({ error: "could not update", _id: req.body._id });
            });
        }
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
