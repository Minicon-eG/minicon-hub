const mongoose = require('mongoose');

mongoose.connect('mongodb://hub-mongo:27017/minicon-website-service')
  .then(async () => {
    const { ChangeRequest } = require('./dist/models/change-request.model.js');
    const crs = await ChangeRequest.find({ siteId: 'tv-dahn' });
    console.log('Found CRs:', crs.length);
    if (crs.length > 0) {
      crs.forEach(cr => {
        console.log('---');
        console.log('ID:', cr._id);
        console.log('Status:', cr.status);
        console.log('Description:', cr.description?.substring(0, 80));
        console.log('Error:', cr.devWorkerError);
        console.log('PreviewUrl:', cr.previewUrl);
      });
    }
    process.exit(0);
  })
  .catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
  });