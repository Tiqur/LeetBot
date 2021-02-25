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

module.exports = parseDifficulty;