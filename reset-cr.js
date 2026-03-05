const mongoose = require('mongoose');

mongoose.connect('mongodb://hub-mongo:27017/minicon-website-service')
  .then(async () => {
    const { ChangeRequest } = require('./dist/models/change-request.model.js');
    
    // Reset the failed CR
    const result = await ChangeRequest.updateOne(
      { _id: '69a8a5c56084d77761c0a12a' },
      { $set: { status: 'new', devWorkerError: null, devWorkerCommit: false } }
    );
    
    console.log('Updated:', result.modifiedCount, 'documents');
    
    // Find and show the CR
    const cr = await ChangeRequest.findById('69a8a5c56084d77761c0a12a');
    console.log('CR now:', cr.status, '-', cr.devWorkerError);
    
    process.exit(0);
  })
  .catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
  });