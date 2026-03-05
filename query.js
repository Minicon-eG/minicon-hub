db = db.getSiblingDB('minicon-website-service');
print("=== Change Requests ===");
crs = db.changeRequests.find().sort({createdAt:-1}).limit(5).toArray();
crs.forEach(function(cr) {
  print("ID: " + cr._id);
  print("Site: " + cr.siteId);
  print("Status: " + cr.status);
  print("Description: " + cr.description.substring(0,100));
  print("Created: " + cr.createdAt);
  print("---");
});

print("\n=== Support Emails (last 3) ===");
emails = db.supportEmails.find().sort({receivedAt:-1}).limit(3).toArray();
emails.forEach(function(e) {
  print("From: " + e.from);
  print("Subject: " + e.subject);
  print("Status: " + e.status);
  print("---");
});