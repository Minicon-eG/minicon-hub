#!/bin/bash
mongosh --quiet --eval '
db = db.getSiblingDB("minicon-hub");
db.getCollectionNames().forEach(c => {
  print(c + ": " + db[c].countDocuments());
});
db.Company.find().forEach(doc => printjson(doc));
'
