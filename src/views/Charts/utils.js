export const getRandomColor = () => {
    const randomNumber = Math.random()
    const amplifiedNumber = randomNumber * 16777215
    const colorNumber = Math.floor(amplifiedNumber)
    const colorString = colorNumber.toString(16)
    const currentColor =  '#' + colorString
    return currentColor
}

export const getOptions = ({pollutantUnit}) => {

    return {
        animations: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Fecha'
                },
                type: 'timeseries',
                time: {
                    'unit': 'month'
                }
            },
            y: {
                title: {
                    display: true,
                    text: `Concentración ${pollutantUnit}`
                }
            }
        }
    }
}
