const fetchProblems = require('./fetchProblems');
const fetchProblemDetails = require('./fetchProblemDetails');


const scrapeProblem = async (options, page) => {
    const problemNameOrId = options.problem;
    let problemsJSON = await fetchProblems(page, options);
    let problem;

    // get problem URL
    if (!problemNameOrId) {
        let difficulty = options.random || 0;
    
        // filter by difficulty
        // if login is added later on, allow subscribed users to access locked content
        if (difficulty) {
            problemsJSON = problemsJSON.filter(p => p.difficulty == difficulty && !p.locked);
        }
        
        // randomly pick a problem
        problem = problemsJSON[Math.floor(Math.random() * problemsJSON.length) + 1];
    } else {

        // find problem by specified args
        problemsJSON.forEach(p => {
            if (problemNameOrId == p.id || problemNameOrId == p.name) {
                problem = p;
            }
        })
    }
    
    await fetchProblemDetails(page, problem)
    
    return problem;
}

module.exports = scrapeProblem;