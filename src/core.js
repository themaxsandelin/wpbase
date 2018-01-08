/**
 * Dependencies
 */
const fs = require('fs');
const dotenv = require('dotenv');


/**
 * WPBase files
 */
const Wordpress = require('./wordpress.js')();
const Development = require('./development.js')();


function Core() {
  /**
   * Setup the project's config object
  */
  const project = {
    path: process.cwd()
  };
  project.name = project.path.substring(project.path.lastIndexOf('/') + 1, project.path.length);
  project.files = fs.readdirSync(project.path);

  /** Load .env file for the project. */
  if (project.files.indexOf('.env') > -1) {
    project.env = dotenv.parse(new Buffer(fs.readFileSync(project.path + '/.env', 'utf8')));
  }

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

    Wordpress.ensure(project)
      .then(() => Development.ensureEnvironment(project))
      .then(() => {
        
      })
    .catch((error) => {
      console.log(error);
    });
  }

  return {
    displayDefaultScreen,
    displayHelpScreen,
    initializeProject
  };
}

module.exports = Core;
