const range = n => [...Array(n).keys()]

const getRandomNum = ({seed}) => {
    const randomNumber = Math.random()
    const finalSeed = seed ?? 10
    return Math.floor(randomNumber * finalSeed)
}

module.exports = {
    getRandomNum, range
};

