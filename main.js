const commander = require('commander');
const chalk = require('chalk');
const { Command } = require('commander');
const puppeteer = require('puppeteer');
const formControlSelector = '[class="form-control"]';



const getStrBetween = (string, a1, a2) => {
    return string.split(a1).pop().split(a2)[0]
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
    let url = 'https://leetcode.com/problemset/all/'

    if (options.difficulty !== undefined) {
        url += `?difficulty=${options.difficulty}`
    }

    if (options.problem !== undefined) {
        url += `?search=${options.problem}`
    }


    await page.goto(url);

    // show all problems
    if (options.problem === undefined) { 
        await page.waitForSelector(formControlSelector)
        await page.select(formControlSelector, '9007199254740991')


        const data = await page.$$eval('table tr td', tds => tds.map((td) => {
            if (td.outerHTML.includes('label="#"') || td.outerHTML.includes('label="Title"')) {
                return td.outerHTML;
            }
            return null;
        }).filter(d => d != null));

        

        let parsedData = [];
        for (i = 0; i < data.length; i+=2) {
            const problemID = getStrBetween(data[i], '">', '</');
            const problemName = getStrBetween(data[i+1], 'e="', '" l');
            const href = getStrBetween(data[i+1], 'href="', '" data-s');
            parsedData.push(`${problemID},${problemName},${href}`)
        }

        console.log(parsedData)


    }
})();
