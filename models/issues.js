"use strict";

require("dotenv").config();
const mongoose = require("mongoose");
const mySecret = process.env["MONGO_URI"];

mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

let issuesShema = new mongoose.Schema({
  project: String,
  issue_title: String,
  issue_text: String,
  created_on: Date,
  updated_on: Date,
  created_by: String,
  assigned_to: String,
  open: Boolean,
  status_text: String,
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
  return issue;
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

/*
const createUser = (userName) => {
  let user = new User({ username: userName });
  user.save();
  return user;
};

async function getUsers() {
  let users = await User.find({});
  return users;
}

const getSingleUser = async (userId) => {
  let user = await User.findById(userId);
  return user;
};

exports.getUsers = getUsers;
exports.User = User;
exports.getSingleUser = getSingleUser;
*/
exports.createIssue = createIssue;
exports.convertIssue = convertIssue;
exports.Issue = Issue;
