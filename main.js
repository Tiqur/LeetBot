const chalk = require('chalk');
const { Command } = require('commander');
const puppeteer = require('puppeteer');
const formControlSelector = '[class="form-control"]';
const langOpts = ['C++', 'Java', 'Python', 'Python3', 'C', 'C#', 'JavaScript', 'Ruby', 'Swift', 'Go', 'Scala', 'Kotlin', 'Rust', 'PHP', 'TypeScript', 'Racket'];
const fs = require('fs');


const updateProblemCache = async (page) => {
    return new Promise(async resolve => {
        let url = 'https://leetcode.com/problemset/all/'
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

            const hrefs = await page.$$eval('[data-slug]', tds => tds.map((td) => {  
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
    
           fs.writeFileSync(`${__dirname}/problems.json`, JSON.stringify(json, null, 4));
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


const findDistance = (array, e1, e2) => {
    const ie1 = array.indexOf(e1);
    const ie2 = array.indexOf(e2);

    return ie1 > ie2 ? (array.length - ie1 + ie2) : (ie2 - ie1);
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
    let storedProblems = JSON.parse(fs.readFileSync(`${__dirname}/problems.json`)).problems;
    let problemNameOrId = options.problem;
    let problem;

    // get problem URL
    if (!problemNameOrId) {
        let difficulty = options.random || 0;
    
        // filter by difficulty
        if (difficulty) {
            storedProblems = storedProblems.filter(p => p.difficulty == difficulty);
        }
        
        // randomly pick a problem
        problem = storedProblems[Math.floor(Math.random() * storedProblems.length) + 1];
    } else {

        // find problem by specified args
        storedProblems.forEach(p => {
            if (problemNameOrId == p.id || problemNameOrId == p.name) {
                problem = p;
            }
        })
    }



    // go to problem
    await page.goto(problem.url);


    await page.waitForSelector('[class~="select-xs__T1oT"]')
    await page.click('[class~="select-xs__T1oT"]')
    await page.keyboard.press('ArrowDown');

    // hardcoded for now
    let userLang = 'JavaScript';
    let currentType = (await page.evaluate(() => Array.from(document.querySelectorAll('[class="ant-select-selection-selected-value"]'), e => e.textContent)))[0];

    // Choose language
    for (i = 0; i < findDistance(langOpts, currentType, userLang)-1; i++) {
        await page.keyboard.press('ArrowDown');
    }
    await page.keyboard.press('Enter');

    // grab pre-generated code from page
    const preGenCode = (await page.$$eval('[class="CodeMirror-code"] div pre', tds => tds.map((td) => {  
        return td.innerText;
    }))).join('\n');

})();



