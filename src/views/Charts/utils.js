export const getRandomColor = () => {
    const randomNumber = Math.random()
    const amplifiedNumber = randomNumber * 16777215
    const colorNumber = Math.floor(amplifiedNumber)
    const colorString = colorNumber.toString(16)
    return  `#${colorString}`

}

export const getOptions = ({pollutantUnit, xScales, yScales}) => {

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
                },
                ...xScales
            },
            y: {
                title: {
                    display: true,
                    text: `Concentración ${pollutantUnit}`
                },
                ...yScales
            }
        }
    }
}
