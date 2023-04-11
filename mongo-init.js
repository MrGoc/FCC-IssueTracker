print("Start create users and db");
db = db.getSiblingDB("IssueTracker");
/*
db.createUser({
  user: "gs1",
  pwd: "gs1",
  roles: [{ role: "readWrite", db: "admin" }],
});
*/
db.createCollection("issues");
print("End create users and db.");
