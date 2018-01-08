#! /usr/bin/env node

/**
 * WPBase files
 */
const Output = require('./src/output.js')();
const Project = require('./src/project.js')();


/**
 * Set up main script based on passed arguments.
*/
const args = process.argv.splice(2, process.argv.length);
if (!args.length) return Output.defaultScreen();

const action = args[0];
if (action === '-h') return Output.helpScreen();
if (action === '-v') return Output.version();
if (action === 'init') return Project.initialize();

console.log(action);
