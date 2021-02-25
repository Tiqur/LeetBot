const chalk = require('chalk');
const formControlSelector = '[class="form-control"]';


const fetchProblems = async (page, options) => {
    console.log(chalk.blueBright("Fetching problems..."));
    return new Promise(async resolve => {
        let url = 'https://leetcode.com/problemset/all/';
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

            const locked = (await page.$$eval('table tr [label="Title"]', tds => tds.map((td) => {  
                return td.innerHTML;
            }))).map(e => {
                return e.includes('Subscribe to unlock');
            });

             
            const problems = [];


            for (i = 0; i < ids.length; i++) {
               problems.push({
                    id: ids[i],
                    name: names[i],
                    difficulty: diffs[i],
                    url: hrefs[i],
                    locked: locked[i]
                });
            }
    
           resolve(problems)
        }
    })
}

module.exports = fetchProblems;