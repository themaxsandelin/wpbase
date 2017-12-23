const request = require('request');
const download = require('download-git-repo');

function WPBase() {

  function setup(config) {
    console.log('Running WPBase..');
  }

  // download('WordPress/WordPress', 'wordpress', (error) => {
  //     if (error) return console.log(error);

  //     console.log('Wordpress downloaded!');
  // });

  // const hashUrl = 'https://api.wordpress.org/secret-key/1.1/salt/';
  // request(hashUrl, (err, res, body) => {
  //     console.log(body);
  //     console.log(process.env);
  // });

  return {
    setup
  };
}

module.exports = WPBase;
