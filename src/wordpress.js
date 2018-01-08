/**
 * Dependencies
 */
const fs = require('fs');
const request = require('request');
const download = require('download-git-repo');

function Wordpress() {
  
  const defaultConfig = JSON.parse(fs.readFileSync(__dirname + '/../default-config.json', 'utf8'));
  const wpHashUrl = 'https://api.wordpress.org/secret-key/1.1/salt/';
  const silenceIsGolden = "<?php\n// Silence is golden.";

  /** Ensure that the project has Wordpress downloaded and that the /wp-content and it's sub folders exists. */
  function ensure(project) {
    return new Promise((resolve, reject) => {
      if (project.files.indexOf('wordpress') > -1) {
        ensureWpContentFolder(project)
          .then(ensureConfigFile(project, false))  
          .then(() => {
            console.log('Wordpress in place.');
            resolve();
          })
        .catch((error) => reject(error));
      } else {
        console.log('No wordpress folder found, downloading wordpress..');
        download('WordPress/WordPress', project.path + '/wordpress', (error) => {
          if (error) return reject(error);

          console.log('Done!');
          ensureConfigFile(project, true)
            .then(() => {
              console.log('Wordpress in place.');
              resolve()
            })
          .catch((error) => reject(error));
        });
      }
    });
  }

  /** Ensure that the whole /wp-content folder (incl. sub folders) exists */
  function ensureWpContentFolder(project) {
    return new Promise((resolve, reject) => {
      const wordpressPath = project.path + '/wordpress';
      let wpContentCreated = false;

      /** Ensure that the /wp-content folder exists */
      if (fs.readdirSync(wordpressPath).indexOf('wp-content') === -1) {
        console.log('No /wp-content folder found, created one.');
        fs.mkdirSync(wordpressPath + '/wp-content');
        wpContentCreated = true;
      }

      /** Ensure that the /wp-content/plugins folder exists */
      if (fs.readdirSync(wordpressPath + '/wp-content').indexOf('plugins') === -1) {
        if (!wpContentCreated) console.log('No /plugins folder found in the /wp-content folder, created one.');
        fs.mkdirSync(wordpressPath + '/wp-content/plugins');
        fs.writeFileSync(wordpressPath + '/wp-content/plugins/index.php', silenceIsGolden);
      }

      /** Ensure that the /wp-content/themes folder exists */
      if (fs.readdirSync(wordpressPath + '/wp-content').indexOf('themes') === -1) {
        if (!wpContentCreated) console.log('No /themes folder found in the /wp-content folder, created one.');
        fs.mkdirSync(wordpressPath + '/wp-content/themes');
        fs.writeFileSync(wordpressPath + '/wp-content/themes/index.php', silenceIsGolden);
      }

      resolve();
    });
  }

  /**
   * Ensure that the wp-config.php file exists in the /wordpress folder
   * If it doesn't, create it based on the default config
   * And if the user project has a .env file, take it into consideration
   */
  function ensureConfigFile(project, downloaded) {
    return new Promise((resolve, reject) => {
      if (!downloaded) {
        /** Check if there already is a wp-config.php file. */
        const wordpressFiles = fs.readdirSync(project.path + '/wordpress');
        if (wordpressFiles.indexOf('wp-config.php') > -1) {
          return resolve();
        }
      }

      console.log('Creating wp-config.php file..');

      /** Setup config parameters from default config and user defined .env file. */
      let config = defaultConfig;
      if (project.env) {
        if (project.env.DB_NAME) config.DB_NAME = project.env.DB_NAME;
        if (project.env.DB_USER) config.DB_USER = project.env.DB_USER;
        if (project.env.DB_PASSWORD) config.DB_PASSWORD = project.env.DB_PASSWORD;
        if (project.env.DB_HOST) config.DB_HOST = project.env.DB_HOST;
        if (project.env.DB_CHARSET) config.DB_CHARSET = project.env.DB_CHARSET;
        if (project.env.DB_COLLATE) config.DB_COLLATE = project.env.DB_COLLATE;
        if (project.env.TABLE_PREFIX) config.TABLE_PREFIX = project.env.TABLE_PREFIX;
        if (project.env.WP_DEBUG) config.WP_DEBUG = project.env.WP_DEBUG;
        console.log('Project .env file found, added user defined wp-config parameters.');
      } else {
        console.log('No .env file found, used default configuration for wp-config parameters.');
      }

      /** Start writing the contents of the wp-config file. */
      let wpConfigString = "<?php\n\n";
      wpConfigString += "/** Database config */\n\n";
      wpConfigString += "define('DB_NAME', '" + config.DB_NAME + "');\n";
      wpConfigString += "define('DB_USER', '" + config.DB_USER + "');\n";
      wpConfigString += "define('DB_PASSWORD', '" + config.DB_PASSWORD + "');\n";
      wpConfigString += "define('DB_HOST', '" + config.DB_HOST + "');\n";
      wpConfigString += "define('DB_CHARSET', '" + config.DB_CHARSET + "');\n";
      wpConfigString += "define('DB_COLLATE', '" + config.DB_COLLATE + "');\n\n";
      wpConfigString += "$table_prefix = '" + config.TABLE_PREFIX + "';\n\n\n";

      /** Load Wordpress hashes form url and add last part of the Wordpress config file. */
      request(wpHashUrl, (err, res, body) => {
        /** Add the final contents of the wp-config file, incl. the hashes. */
        wpConfigString += "/** Wordpress hashes */\n\n";
        wpConfigString += body + "\n\n";

        wpConfigString += "/** Debug mode for developers */\n\n";
        wpConfigString += "define('WP_DEBUG', " + ((parseInt(config.WP_DEBUG)) ? "true":"false") + ");\n\n\n"

        wpConfigString += "/** Absolute path to the WordPress directory. */\n\n";
        wpConfigString += "if (!defined('ABSPATH')) {\n";
        wpConfigString += "  define('ABSPATH', dirname(__FILE__) . '/');\n";
        wpConfigString += "}\n\n\n";

        wpConfigString += "/** Sets up WordPress vars and included files. */\n\n";
        wpConfigString += "require_once(ABSPATH . 'wp-settings.php');\n";

        /** Write the contents to a wp-config.php file. */
        fs.writeFileSync(project.path + '/wordpress/wp-config.php', wpConfigString);
        console.log('wp-config file created.');
        resolve();
      });
    });
  }

  return {
    ensure
  };
}

module.exports = Wordpress;
