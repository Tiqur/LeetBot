const commander = require('commander');
const chalk = require('chalk');
const { Command } = require('commander');


const program = new Command()
    .option('-r --random', 'Pick a random LeetCode problem')
    .option('-d --difficulty <option>', 'Choose problem difficulty')
    .option('-p --problem <string, id>', 'Choose specific problem by string or ID')
    .parse();

const options = program.opts();
console.log(options)