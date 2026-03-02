const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('C:\\Users\\Michael\\.openclaw\\media\\inbound\\file_8---729fbd47-1396-4eae-9396-51deb524b8f6.pdf');

pdf(dataBuffer).then(function(data) {
    console.log('Pages:', data.numpages);
    console.log('--- TEXT CONTENT ---');
    console.log(data.text);
}).catch(function(error){
    console.log('Error:', error);
})
