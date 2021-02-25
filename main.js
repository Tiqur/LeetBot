const chalk = require('chalk');
const { Command } = require('commander');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { scrapeProblem, parseDifficulty } = require('./functions/lib');



const program = new Command()
    .option('-r --random <difficulty>', 'Pick a random LeetCode problem ( easy, medium, hard, or all )', parseDifficulty)
    .option('-p --problem <string, id>', 'Choose specific problem by string or ID')
    .parse();

const options = program.opts();



(async () => {
    const browser = await puppeteer.launch({headless: true,});
    const page = await browser.newPage();
    const problem = await scrapeProblem(options, page);

    // write pre-generated code to local file
    fs.writeFileSync(`${problem.id}.js`, `/*\n${problem.description}\n*/\n\n\n${problem.preGenCode}`);
})();



