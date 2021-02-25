const findDistance = require('./findDistance');
const langOpts = ['C++', 'Java', 'Python', 'Python3', 'C', 'C#', 'JavaScript', 'Ruby', 'Swift', 'Go', 'Scala', 'Kotlin', 'Rust', 'PHP', 'TypeScript', 'Racket'];


const changeLanguage = async (page) => {
    return new Promise(async resolve => {
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
        resolve();
    })
}

module.exports = changeLanguage;