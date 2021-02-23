const commander = require('commander');
const chalk = require('chalk');
const { Command } = require('commander');
const puppeteer = require('puppeteer');
const formControlSelector = '[class="form-control"]';
const fs = require('fs');

const getStrBetween = (string, a1, a2) => {
    return string.split(a1).pop().split(a2)[0]
}

const updateProblemCache = async (page) => {
    return new Promise(async resolve => {
        let url = 'https://leetcode.com/problemset/all/'
        await page.goto(url);
    
        // show all problems
        if (options.problem === undefined) { 
            await page.waitForSelector(formControlSelector)
            await page.select(formControlSelector, '9007199254740991')


            const diffs = await page.$$eval('table tr td [class~="label"]', tds => tds.map((td) => {  
                return td.innerText;
            }));
    
            const ids = await page.$$eval('table tr [label="#"]', tds => tds.map((td) => {  
                return td.innerText;
            }));

            const names = await page.$$eval('table tr [data-slug]', tds => tds.map((td) => {  
                return td.innerText;
            }));

            const hrefs = await page.$$eval('table tr a', tds => tds.map((td) => {  
                return td.href;
            }));


            const json = {
                problems: []
            }

            for (i = 0; i < ids.length; i++) {
               json.problems.push({
                    id: ids[i],
                    name: names[i],
                    difficulty: diffs[i],
                    url: hrefs[i]
                });
            }
    
            console.log(json)
           fs.writeFileSync('problems.json', JSON.stringify(json, null, 4));
           resolve()
        }
    })
}


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
    await updateProblemCache(page);
})();
// if (options.difficulty !== undefined) {
//     url += `?difficulty=${options.difficulty}`
// }

// if (options.problem !== undefined) {
//     url += `?search=${options.problem}`
// }

