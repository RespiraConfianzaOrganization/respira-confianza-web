import moment from "moment";
import {colors} from "../../Constants";

Number.prototype.betweenWithoutTouch = function (min, max) {
    if (min && max) return this >= min && this < max
    else if (min && !max) return this >= min
    else if (!min && max) return this < max
    else return false
}

export const getOptions = ({pollutantUnit, xScales, yScales}) => {

    return {
        animations: false,
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

export const getStationName = ({stations, stationId}) => {
    const [station] = stations.filter(s => s.id === stationId)
    return station.name
}

export const getColorDependingOnThreshold = ({value, thresholds}) => {
    const {good, moderate, unhealthy, very_unhealthy, dangerous} = thresholds
    const number = !value ? 0 : Number(value)
    let color
    if (number.betweenWithoutTouch(0, good)){
        color = colors.LessThanGood
    } else if (number.betweenWithoutTouch(good, moderate)){
        color = colors.BetweenGoodAndModerate
    } else if (number.betweenWithoutTouch(moderate, unhealthy)){
        color = colors.BetweenModerateAndUnhealthy
    } else if (number.betweenWithoutTouch(unhealthy, very_unhealthy)){
        color = colors.BetweenUnhealthyAndVeryUnhealthy
    } else if (number.betweenWithoutTouch(very_unhealthy, dangerous)){
        color = colors.BetweenVeryUnhealthyAndDangerous
    } else {
        color = colors.MoreThanDangerous
    }
    return color
}


export const getChartPrimaryTitle = ({days}) => {
    const alternativeA = `Visualización de contaminantes para el último día`
    const alternativeB = `Visualización de contaminantes para los últimos ${days} días`
    const shouldUseAlternativeA = days === 1
    return shouldUseAlternativeA ? alternativeA : alternativeB
}

export const getChartSecondaryTitle = ({startDate, endDate}) => {
    const startDateString = moment(startDate).format('DD/MM/YYYY')
    const endDateString = moment(endDate).format('DD/MM/YYYY')
    return `Mediciones obtenidas entre ${startDateString} y ${endDateString}`
}
