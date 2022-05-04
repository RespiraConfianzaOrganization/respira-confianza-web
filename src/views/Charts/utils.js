import {getColorPalette} from "../../utils/colors";

export const getOptions = ({pollutantUnit, xScales, yScales}) => {

    return {
        animations: false,
        showLine: false,
        hover: {
            animationDuration: 0
        },
        responsiveAnimationDuration: 0,
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

const getStationName = ({stations, stationId}) => {
    const [station] = stations.filter(s => s.id === stationId)
    return station.name
}

export const getCurrentDatasets = ({readings, stations, pollutantName}) => {
    const currentDatasets = []
    const colors = getColorPalette(stations.length)

    stations.forEach(({id}, idx) => {
        const stationName = getStationName({stationId: id,
            stations: stations})
        const stationReadings = readings[id]
        const currentValues = []
        stationReadings.forEach(o => {
            const value = {
                x: o.timestamp,
                y: o[pollutantName.toLowerCase()]
            }
            currentValues.push(value)
        })
        currentDatasets.push({
            label: stationName,
            data: currentValues,
            backgroundColor: colors[idx],
        })
    })

    return currentDatasets
}
