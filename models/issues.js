"use strict";

require("dotenv").config();
const mongoose = require("mongoose");
const mySecret = process.env["MONGO_URI"];

mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

let issuesShema = new mongoose.Schema({
  project: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: "" },
  status_text: { type: String, default: "" },
  created_on: { type: Date, default: Date() },
  updated_on: { type: Date, default: Date() },
  open: { type: Boolean, default: true },
});

let Issue = mongoose.model("Issue", issuesShema, "issues");

const createIssue = (
  project,
  title,
  text,
  createdBy,
  assignedTo,
  statusText
) => {
  let now = Date.now();
  let issue = new Issue({
    project: project,
    issue_title: title,
    issue_text: text,
    created_on: now,
    updated_on: now,
    created_by: createdBy,
    assigned_to: assignedTo,
    open: true,
    status_text: statusText,
  });
  issue.save();
  return convertIssue(issue);
};

const convertIssue = (issue) => {
  return {
    _id: issue._id,
    issue_title: issue.issue_title,
    issue_text: issue.issue_text,
    created_on: issue.created_on,
    updated_on: issue.updated_on,
    created_by: issue.created_by,
    assigned_to: issue.assigned_to,
    open: issue.open,
    status_text: issue.status_text,
  };
};

exports.createIssue = createIssue;
exports.convertIssue = convertIssue;
exports.Issue = Issue;
