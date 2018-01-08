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

  function generateHeaderFileContents() {
    return fs.readFileSync(__dirname + '/default-files/header.php', 'utf8');
  }

  function generateFooterFileContents() {
    return fs.readFileSync(__dirname + '/default-files/footer.php', 'utf8');
  }

  function generateNotFoundFileContents() {
    return fs.readFileSync(__dirname + '/default-files/404.php', 'utf8');
  }

  function generateIndexFileContents() {
    return fs.readFileSync(__dirname + '/default-files/index.php', 'utf8');
  }

  function generatePageFileContents() {
    return fs.readFileSync(__dirname + '/default-files/page.php', 'utf8');
  }

  return {
    generateStyleFileContents,
    generateHeaderFileContents,
    generateFooterFileContents,
    generateNotFoundFileContents,
    generateIndexFileContents,
    generatePageFileContents
  };
}

module.exports = Files;
