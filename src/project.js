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
const Files = require('./files.js')();


function Project() {
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

  function ensureBaseFiles(project) {
    return new Promise((resolve, reject) => {

      /** Make sure an .editorconfig file exists */
      if (project.files.indexOf('.editorconfig') === -1) {
        fs.writeFileSync(project.path + '/.editorconfig', Files.getDefaultFile('editorconfig'));
        console.log('No .editorconfig file found, created it.');
      }

      /** Make sure an .gitignore file exists. */
      if (project.files.indexOf('.gitignore') === -1) {
        fs.writeFileSync(project.path + '/.gitignore', Files.getDefaultFile('gitignore'));
        console.log('No .gitignore file found, created it.');
      }

      /** Make sure a README.md file exists. */
      if (project.files.indexOf('README.md') === -1) {
        fs.writeFileSync(project.path + '/README.md', Files.generateReadmeFileContents(project));
        console.log('No README.md file found, created it.');
      }

    });
  }

  function initialize() {
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
      .then(() => ensureBaseFiles(project))
      .then(() => {
        
      })
    .catch((error) => {
      console.log(error);
    });
  }

  return {
    initialize
  };
}

module.exports = Project;
