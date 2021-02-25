const chalk = require('chalk');
const changeLanguage = require('./changeLanguage');


const fetchProblemDetails = async (page, problem) => {
    console.log(chalk.blueBright("Parsing details..."));


    // go to problem
    await page.goto(problem.url);

    // change language on leetcode 
    await changeLanguage(page);
    
    // grab pre-generated code from page
    problem.preGenCode = (await page.$$eval('[class="CodeMirror-code"] div pre', tds => tds.map((td) => {  
        return td.innerText;
    }))).join('\n');


    // grab problem description from page
    const desc = (await page.$$eval('[class="description__24sA"] div div', tds => tds.map((td) => {  
        return td.innerText;
    })));

    problem.description = desc[0] + desc[3];
}

module.exports = fetchProblemDetails;