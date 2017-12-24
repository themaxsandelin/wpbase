#! /usr/bin/env node

/**
 * Dependencies
*/
const fs = require('fs');
const dotenv = require('dotenv');


/**
 * WPBase files
 */
const Wordpress = require('./src/wordpress.js')();


/**
 * User project variables
*/
const projectPath = process.cwd();
const projectFolder = projectPath.substring(projectPath.lastIndexOf('/') + 1, projectPath.length);
let projectFiles = fs.readdirSync(projectPath);

/** Load .env file for the project. */
let projectEnv;
if (projectFiles.indexOf('.env') > -1) {
  projectEnv = dotenv.parse( new Buffer( fs.readFileSync(projectPath + '/.env', 'utf8') ) );
}


/**
 * Set up main script based on passed arguments.
*/
const args = process.argv.splice(2, process.argv.length);

/** No arguments given, display default screen. */
if (!args.length) return displayDefaultScreen();

const action = args[0];
if (action === '-h') return displayHelpScreen();
if (action === 'init') return initializeProject();

console.log(action);




function displayDefaultScreen() {
  console.log('');
  console.log('Thank you for using WPBase for your Wordpress project! 🙌');
  console.log('');
  console.log('  > Type [wpbase -h] to display the help screen and learn how to use it.');
  console.log('');
}

function displayHelpScreen() {

}

function initializeProject() {
  /**
   * Initialization process:
   * 
   * 1. Make sure there is a wp-config file.
   * 2. Make sure there is a Wordpress directory
   * 3. Set up /src directory for working on the theme.
   * 4. Ensure there is a build config file for whatever building library the user selects, start with Gulp for now.
   */
  
  Wordpress.ensure(projectPath, projectFiles, projectEnv)
    .then(() => {

    })
  .catch((error) => {
    console.log(error);
  });


  // ensureWpConfigFile()
  //   .then((status) => {

  //   })
  // .catch((error) => {
  //   console.log(error);
  // });

  
}
