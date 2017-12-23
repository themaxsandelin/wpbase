#! /usr/bin/env node

/**
 * Dependencies
*/
const fs = require('fs');
const request = require('request');
const download = require('download-git-repo');

/**
 * Project config variables
*/
const configFileName = 'wpbase.json';
const wpHashUrl = 'https://api.wordpress.org/secret-key/1.1/salt/';


/**
 * Grab the CLI arguments
*/
const args = process.argv.splice(2, process.argv.length);



const projectPath = process.cwd();
const projectFolder = projectPath.substring(projectPath.lastIndexOf('/') + 1, projectPath.length);
const currentFiles = fs.readdirSync(projectPath);

let config;
if (currentFiles.indexOf(configFileName) === -1) {
  config = JSON.parse(fs.readFileSync(__dirname + '/default-config.json', 'utf8'));
  config.DB_NAME = projectFolder;
} else {
  config = fs.readFileSync(projectPath + '/' + configFileName, 'utf8');
  if (!JSON.parse(config)) return console.log(new Error('Invalid JSON format in ' . configFileName));

  config = JSON.parse(config);
}


let wpConfigString = "/*\n MySQL parameters \n*/\n\n";
wpConfigString += "define('DB_NAME', '" + config.DB_NAME + "');\n";
wpConfigString += "define('DB_USER', '" + config.DB_USER + "');\n";
wpConfigString += "define('DB_PASSWORD', '" + config.DB_PASSWORD + "');\n";
wpConfigString += "define('DB_HOST', '" + config.DB_HOST + "');\n\n\n";

console.log('Fetching Wordpress hashes..');
request(wpHashUrl, (err, res, body) => {

  wpConfigString += "/*\n Wordpress hashes \n*/\n\n";
  wpConfigString += body;

  console.log(wpConfigString);
});

// download('WordPress/WordPress', 'wordpress', (error) => {
//   if (error) return console.log(error);

//   console.log('Wordpress downloaded!');
// });
