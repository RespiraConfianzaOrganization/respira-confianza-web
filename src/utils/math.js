export const range = n => [...Array(n).keys()]

module.exports = {
    range
};
export const getRandomNum = ({seed}) => {
    const randomNumber = Math.random()
    const finalSeed = seed ?? 10
    return Math.floor(randomNumber * finalSeed)
}

