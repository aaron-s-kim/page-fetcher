// fetcher.js
// > node fetcher.js http://www.example.edu/ ./index.html
// Code should download the resource at the URL to the local path on your machine.
// Upon completion, should print out a message:
//  Downloaded and saved 1235 bytes to ./index.html.

const args = process.argv.slice(2, 4);
const url = args[0];
const filePath = args[1];

const request = require('request');

const fs = require('fs');
const readline = require('readline');

request(url, (error, response, body) => {
  // console.log('error:', error); // Print the error if one occurred
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the HTML for the url
  
  fs.access(filePath, (err) => {
    if (err) { // if file does not exist, write file
      
      fs.writeFile(filePath, body, err => {
        if (err) {
          console.error(err);
          return;
        } else {
          const stats = fs.statSync(filePath);
          cbPrintFileInfo(stats);
        }
      });
      
    } else { // if file does exist, prompt overwrite question
      console.log('Path exists');

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question("Press y then enter to overwrite existing file: ", (answer) => {
        if (answer === "y") {
          fs.writeFile(filePath, body, err => {
            if (err) {
              console.error(err);
              return;
            } else {
              const stats = fs.statSync(filePath);
              cbPrintFileInfo(stats);
            }
          });
          console.log(`File overwritten.`);
        } else {
          console.log(`File NOT overwritten.`);
        }
        rl.close();
      });
    }
  });

});

const cbPrintFileInfo = stats => {
  console.log(`Downloaded and saved ${stats.size} bytes to ${filePath}`);
};

// If file already exists, prompt for overwrite
// If file path invalid, app should fail, and inform user


// // Notes
// When trying to control async operation order, can use nested callbacks.
// 1 character is = 1 byte, so body.length can work as well
