/**
 * Dependencies
 */
const fs = require('fs');

function Files() {

  function generateStyleFileContents(project) {
    let contents = fs.readFileSync(__dirname + '/default-files/style.scss', 'utf8');
    while (contents.indexOf('[project-name]') > -1) {
      contents = contents.replace('[project-name]', project.name);
    }
    contents = contents.replace('[theme-uri]', ((project.repository) ? 'Theme URI: ' + project.repository:''));
    contents = contents.replace('[description]', 'Description: ' + project.name + ' Wordpress theme');
    return contents;
  }

  function generateReadmeFileContents(project) {
    let contents = fs.readFileSync(__dirname + '/default-files/README.md', 'utf8');
    while (contents.indexOf('[project-name]') > -1) {
      contents = contents.replace('[project-name]', project.name);
    }
    contents = contents.replace('[description]', project.name + ' Wordpress theme');
    return contents;
  }

  function getDefaultFile(file) {
    return fs.readFileSync(__dirname + '/default-files/' + file, 'utf8');
  }

  return {
    generateStyleFileContents,
    generateReadmeFileContents,
    getDefaultFile
  };
}

module.exports = Files;
