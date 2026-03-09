const { sendEmail } = require('./dist/services/email.service');

sendEmail({
  to: 'michael.nikolaus@minicon.eu',
  subject: 'Test E-Mail von Atlas',
  html: '<h1>Test</h1><p>Dies ist eine Test-E-Mail.</p>'
}).then(() => console.log('SUCCESS')).catch(e => console.log('ERROR:', e.message));
