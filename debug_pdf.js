const fs = require('fs');
const pdfLib = require('pdf-parse');

console.log(typeof pdfLib);
console.log(pdfLib);

const dataBuffer = fs.readFileSync('C:\\Users\\Michael\\.openclaw\\media\\inbound\\file_8---729fbd47-1396-4eae-9396-51deb524b8f6.pdf');

// Based on output, I will adjust manually in next step if this debug fails to parse
// But usually require('pdf-parse') returns the function directly. 
// If it's empty object, something is wrong with installation or environment.
