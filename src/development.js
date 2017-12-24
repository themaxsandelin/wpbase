/**
 * Dependencies
 */
const fs = require('fs');

function Development() {
  const defaultDevFolder = '/src';

  function ensureEnvironment(project) {
    return new Promise((resolve, reject) => {
      /** Update the files property to make sure you have the latest list. */
      project.files = fs.readdirSync(project.path);
      
      if (project.files.indexOf('src') === -1) {
        /** No /src folder exists, create it and run setup. */
      }
    });
  }

  return {
    ensureEnvironment
  };
}

module.exports = Development;
