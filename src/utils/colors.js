const {getRandomNum} = require("./math");

const getRandomColor = () => {
    const randomNumber = Math.random()
    const amplifiedNumber = randomNumber * 16777215
    const colorNumber = Math.floor(amplifiedNumber)
    const colorString = colorNumber.toString(16)
    return `#${colorString}`
}

const getColorPalette = (n) => {

    const letters = '0123456789abcdef'
    const colors = []

    for (let i = 0; i < n; i++){
        let hexColor = "#"
        for (let i = 0; i < 6; i++){
            const ind = getRandomNum({seed: letters.length})
            const letter = letters[ind]
            hexColor += letter
        }
        colors.push(hexColor)
    }

    return colors
}

module.exports = {
    getRandomColor, getColorPalette
};

