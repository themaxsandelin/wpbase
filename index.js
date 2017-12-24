#! /usr/bin/env node

/**
 * WPBase files
 */
const Core = require('./src/core.js')();


/**
 * Set up main script based on passed arguments.
*/
const args = process.argv.splice(2, process.argv.length);
if (!args.length) return Core.displayDefaultScreen();

const action = args[0];
if (action === '-h') return Core.displayHelpScreen();
if (action === 'init') return Core.initializeProject();

console.log(action);
