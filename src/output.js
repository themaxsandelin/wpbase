function Output() {
  
  function defaultScreen() {
    console.log('');
    console.log('Thank you for using WPBase for your Wordpress project! 🙌');
    console.log('');
    console.log('  > Type [wpbase -h] to display the help screen and learn how to use it.');
    console.log('');
  }

  function version() {
    console.log(JSON.parse(fs.readFileSync(__dirname + '../package.json')).version);
  }

  function helpScreen() {
    console.log('');
    console.log('\x1b[32m%s\x1b[0m', 'WPBase');
    console.log('');
    console.log('Usage:');
    console.log('');
    console.log('\x1b[32m%s\x1b[0m', '  wpbase init');
    console.log('  Will initialize your project by analyzing an creating all files and folders (if any are missing).');
    console.log('');
    console.log('Options:');
    console.log('');
    console.log('\x1b[32m%s\x1b[0m', '  wpbase -h');
    console.log('  Will show this screen.');
    console.log('\x1b[32m%s\x1b[0m', '  wpbase -v');
    console.log('  Will show which version you have installed.');
    console.log('');
  }

  return {
    defaultScreen,
    version,
    helpScreen
  };
}

module.exports = Output;
