const fs = require('fs');
const pdfLib = require('pdf-parse');

const dataBuffer = fs.readFileSync('C:\\Users\\Michael\\.openclaw\\media\\inbound\\file_8---729fbd47-1396-4eae-9396-51deb524b8f6.pdf');

let parse = pdfLib;
// Check if it's a default export
if (typeof pdfLib !== 'function' && pdfLib.default) {
    parse = pdfLib.default;
}

try {
    parse(dataBuffer).then(function(data) {
        console.log('Pages:', data.numpages);
        console.log('--- CONTENT START ---');
        console.log(data.text);
        console.log('--- CONTENT END ---');
    }).catch(function(error){
        console.log('Error parsing PDF:', error);
    })
} catch (e) {
    console.log("Error calling pdf-parse:", e);
}
