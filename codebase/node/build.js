const fs = require('fs');
const path = require('path');
const uglifyJS = require('uglify-js');

const folders = [ '../source/global', '../source/main', '../source/game', '../source/classes', '../source/util'];

// Minify Combine + uglify minify

// fs.writeFileSync('../build/i.js', uglifyJS.minify(
//   folders.map(dir => fs.readdirSync(dir).map(file => fs.readFileSync(path.join(dir, file), 'utf8')).join('')).join(''),
//   { 
//     toplevel: true,
//     output: {
//         comments: false, // Remove all comments
//         beautify: false, // Do not beautify the output (compact as much as possible)
//       },
//         compress: {
//             drop_console: true,         // Remove all console.* statements
//       passes: 5,                  // Increase number of passes for better compression
//       dead_code: true,            // Remove unreachable code
//       drop_debugger: true, 
//     }
// }
// ).code);


// Simple Combine of files
fs.copyFileSync(path.join(__dirname, '../source/index.html'), path.join(__dirname, '../build/index.html'));
fs.copyFileSync(path.join(__dirname, '../source/style.css'), path.join(__dirname, '../build/style.css'));

fs.writeFileSync(
    '../build/i.js',
    folders.map(dir =>
        fs.readdirSync(dir)
        .map(file =>
            fs.readFileSync(path.join(dir, file), 'utf8')
        )
        .join('\n') 
        )
    .join('\n'),
  'utf8'
);


// Setup: 
// 'npm install' if package.json is already there, else:
// npm init 
// npm install uglify-js --save

// Run With:
// node .\build.js