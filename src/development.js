/**
 * Dependencies
 */
const fs = require('fs');
const simpleGit = require('simple-git')(process.cwd());

/**
 * WPBase files
 */
const Files = require('./files.js')();

function Development() {
  const sourceFolderName = 'src';
  let sourceFolderPath;
  let sourceFolderFiles;

  const resourcesFolderName = 'resources';
  let resourcesFolderPath;
  let resourcesFolderFiles;

  const stylesFolderName = 'css';
  const scriptsFolderName = 'js';
  const imageFolderName = 'img';

  const styleFileName = 'style.scss';

  function ensureFolderStructure(project) {
    sourceFolderPath = project.path + '/' + sourceFolderName;
    resourcesFolderPath = sourceFolderPath + '/' + resourcesFolderName;

    /** Make sure the proper source folder exists for the theme's code base. */
    if (project.files.indexOf(sourceFolderName) === -1) {
      fs.mkdirSync(sourceFolderPath);
      console.log('No /' + sourceFolderName + ' development folder found, created it.');
    }

    sourceFolderFiles = fs.readdirSync(sourceFolderPath);

    /** Make sure the resources folder exists. */
    if (sourceFolderFiles.indexOf(resourcesFolderName) === -1) {
      fs.mkdirSync(resourcesFolderPath);
      console.log('No /' + resourcesFolderName + ' folder found in the ' + sourceFolderName + ' folder, created it.');
    }

    resourcesFolderFiles = fs.readdirSync(resourcesFolderPath);

    /** Make sure a styles folder exists, inside the resources folder, with a .gitkeep file inside of it. */
    if (resourcesFolderFiles.indexOf(stylesFolderName) === -1) {
      fs.mkdirSync(resourcesFolderPath + '/' + stylesFolderName);
      fs.writeFileSync(resourcesFolderPath + '/' + stylesFolderName + '/.gitkeep', '');
      console.log('No /' + stylesFolderName + ' folder found in the /' + resourcesFolderName + ' folder, created it with a .gitkeep file inside.');
    }

    /** Make sure a scripts folder exists, inside the resources folder, with a .gitkeep file inside of it. */
    if (resourcesFolderFiles.indexOf(scriptsFolderName) === -1) {
      fs.mkdirSync(resourcesFolderPath + '/' + scriptsFolderName);
      fs.writeFileSync(resourcesFolderPath + '/' + scriptsFolderName + '/.gitkeep', '');
      console.log('No /' + scriptsFolderName + ' folder found in the /' + resourcesFolderName + ' folder, created it with a .gitkeep file inside.');
    }

    /** Make sure an image folder exists, inside the resources folder, with a .gitkeep file inside of it. */
    if (resourcesFolderFiles.indexOf(imageFolderName) === -1) {
      fs.mkdirSync(resourcesFolderPath + '/' + imageFolderName);
      fs.writeFileSync(resourcesFolderPath + '/' + imageFolderName + '/.gitkeep', '');
      console.log('No /' + imageFolderName + ' folder found in the /' + resourcesFolderName + ' folder, created it with a .gitkeep file inside.');
    }
  }

  function ensureFiles(project) {
    /** Make sure the style.scss file exists. */
    if (sourceFolderFiles.indexOf(styleFileName) === -1) {
      fs.writeFileSync(sourceFolderPath + '/' + styleFileName, Files.generateStyleFileContents(project));
      console.log('No ' + styleFileName + ' found in the ' + sourceFolderName + ' folder, created it.');
    }

    /** Make sure the functions.php file exists. */
    if (sourceFolderFiles.indexOf('functions.php') === -1) {
      fs.writeFileSync(sourceFolderPath + '/functions.php', '');
      console.log('No functions.php file found in the ' + sourceFolderName + ' folder, created it.')
    }

    /** Make sure the header.php file exists. */
    if (sourceFolderFiles.indexOf('header.php') === -1) {
      fs.writeFileSync(sourceFolderPath + '/header.php', Files.getDefaultFile('header.php'));
      console.log('No header.php file found in the ' + sourceFolderName + ' folder, created it.');
    }

    /** Make sure the footer.php file exists. */
    if (sourceFolderFiles.indexOf('footer.php') === -1) {
      fs.writeFileSync(sourceFolderPath + '/footer.php', Files.getDefaultFile('footer.php'));
      console.log('No header.php file found in the ' + sourceFolderName + ' folder, created it.');
    }

    /** Make sure the 404.php file exists. */
    if (sourceFolderFiles.indexOf('404.php') === -1) {
      fs.writeFileSync(sourceFolderPath + '/404.php', Files.getDefaultFile('404.php'));
      console.log('No 404.php file found in the ' + sourceFolderName + ' folder, created it.');
    }

    /** Make sure the index.php file exists. */
    if (sourceFolderFiles.indexOf('index.php') === -1) {
      fs.writeFileSync(sourceFolderPath + '/index.php', Files.getDefaultFile('index.php'));
      console.log('No index.php file found in the ' + sourceFolderName + ' folder, created it.');
    }

    /** Make sure the page.php file exists. */
    if (sourceFolderFiles.indexOf('page.php') === -1) {
      fs.writeFileSync(sourceFolderPath + '/page.php', Files.getDefaultFile('page.php'));
      console.log('No page.php file found in the ' + sourceFolderName + ' folder, created it.');
    }
  }

  function ensureGit() {
    return new Promise((resolve, reject) => {
      simpleGit.checkIsRepo((err, res) => {
        if (err) return reject(err);

        if (!res) {
          simpleGit.init(false, (err, res) => {
            if (err) return reject(err);

            console.log('No git repo found, initialize one.');
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  function ensureEnvironment(project) {
    return new Promise((resolve, reject) => {
      /** Update the files property to make sure you have the latest list. */
      project.files = fs.readdirSync(project.path);

      /** Make sure the development environment's folder structure exists as configured */
      ensureFolderStructure(project);

      /** Make sure the development environment's files exists as configured */
      ensureFiles(project);

      console.log('Development environment in place.');
      
      resolve();
    });
  }

  return {
    ensureGit,
    ensureEnvironment
  };
}

module.exports = Development;
