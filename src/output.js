function Output() {
  
  function defaultScreen() {
    console.log('');
    console.log('Thank you for using WPBase for your Wordpress project! 🙌');
    console.log('');
    console.log('  > Type [wpbase -h] to display the help screen and learn how to use it.');
    console.log('');
  }

  function helpScreen() {

  }

  return {
    defaultScreen,
    helpScreen
  };
}

module.exports = Output;
