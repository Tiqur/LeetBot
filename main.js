const commander = require('commander');
const chalk = require('chalk');
const { Command } = require('commander');
const puppeteer = require('puppeteer');
const inputBoxSelector = '[class="form-control list-search-bar"]'
const formControlSelector = '[class="form-control"]'

const parseDifficulty = (value) => {
    switch(value) {
        case 'easy':
        case 'e':
        case '1':
            return "Easy";        
        case 'medium':
        case 'm':
        case '2':
            return "Medium";        
        case 'hard':
        case 'h':
        case '3':
            return "Hard";
    }
    
    throw new commander.InvalidOptionArgumentError('\nPlease choose one of the following: \n(easy, medium, hard)');
}

const program = new Command()
    .option('-r --random', 'Pick a random LeetCode problem')
    .option('-d --difficulty <option>', 'Choose problem difficulty', parseDifficulty)
    .option('-p --problem <string, id>', 'Choose specific problem by string or ID')
    .parse();

const options = program.opts();



(async () => {
    const browser = await puppeteer.launch({headless: false,});
    const page = await browser.newPage();
    let url = 'https://leetcode.com/problemset/all/'

    if (options.problem === undefined) { 
        url += `?difficulty=${options.difficulty}`
    } else {
        url += `?search=${options.problem}`
    }

    await page.goto(url);

    // show all problems
    if (options.problem === undefined) { 
        await page.waitForSelector(formControlSelector)
        await page.select(formControlSelector, '9007199254740991')
    }
})();