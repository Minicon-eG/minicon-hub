const mongoose = require('mongoose');

mongoose.connect('mongodb://hub-mongo:27017/minicon-website-service')
  .then(async () => {
    const { ChangeRequest } = require('./dist/models/change-request.model.js');
    
    // Change status to preview so dev-worker picks it up
    const result = await ChangeRequest.updateOne(
      { _id: '69a8a5c56084d77761c0a12a' },
      { $set: { status: 'preview', devWorkerError: null } }
    );
    
    console.log('Updated:', result.modifiedCount, 'documents');
    
    // Find and show the CR
    const cr = await ChangeRequest.findById('69a8a5c56084d77761c0a12a');
    console.log('CR now:', cr.status, '- Error:', cr.devWorkerError);
    
    process.exit(0);
  })
  .catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
  });