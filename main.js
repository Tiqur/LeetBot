const commander = require('commander');
const chalk = require('chalk');
const { Command } = require('commander');
const puppeteer = require('puppeteer');
const formControlSelector = '[class="form-control"]';
const fs = require('fs');
const { url } = require('inspector');


const updateProblemCache = async (page) => {
    return new Promise(async resolve => {
        let url = 'https://leetcode.com/storedProblemset/all/'
        await page.goto(url);
    
        // show all storedProblems
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
                storedProblems: []
            }

            for (i = 0; i < ids.length; i++) {
               json.storedProblems.push({
                    id: ids[i],
                    name: names[i],
                    difficulty: diffs[i],
                    url: hrefs[i]
                });
            }
    
           fs.writeFileSync('storedProblems.json', JSON.stringify(json, null, 4));
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
        default:
            return 0;
    }
}

const program = new Command()
    .option('-r --random <difficulty>', 'Pick a random LeetCode problem ( easy, medium, hard, or all )', parseDifficulty)
    .option('-p --problem <string, id>', 'Choose specific problem by string or ID')
    .parse();

const options = program.opts();

(async () => {
    const browser = await puppeteer.launch({headless: false,});
    const page = await browser.newPage();
    await updateProblemCache(page);
    let storedProblems = JSON.parse(fs.readFileSync("./problems.json")).problems;
    let problemNameOrId = options.problem;
    let URL;

    // get problem URL
    if (!problemNameOrId) {
        let difficulty = options.random || 0;
    
        // filter by difficulty
        if (difficulty) {
            storedProblems = storedProblems.filter(p => p.difficulty == difficulty);
        }
        
        // randomly pick a problem
        URL = storedProblems[Math.floor(Math.random() * storedProblems.length) + 1].url;
    } else {

        // find problem by specified args
        storedProblems.forEach(p => {
            if (problemNameOrId == p.id || problemNameOrId == p.name) {
                URL = p.url;
            }
        })
    }


    page.goto(url);
})();

