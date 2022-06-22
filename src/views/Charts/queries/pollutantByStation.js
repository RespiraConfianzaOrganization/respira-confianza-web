import {postRequest} from "../../../utils/axios";
import {getColorDependingOnThreshold, getCurrentDatasets, getStationName} from "../utils";
import {getThresholdsByPollutant} from "./thresholds";

const POLLUTANTS_BY_STATIONS = `${process.env.REACT_APP_API_URL}/api/pollutants-by-stations`

export async function getDatasets({pollutant, station, startDate, endDate, groupByTime}) {

    const queryData = {
        pollutants: [pollutant.name],
        stations: [station.id],
        startDate: startDate,
        endDate: endDate,
        groupByTime: groupByTime
    }

    const readingsResponse = await postRequest(POLLUTANTS_BY_STATIONS, queryData)
    const {readings} = readingsResponse?.data

    const pollutantName = pollutant.name

    const pollutantThresholds = await getThresholdsByPollutant(pollutantName)

    const currentDatasets = []

    const thresholdsKeys = ['good', 'moderate', 'unhealthy', 'very_unhealthy', 'dangerous']

    thresholdsKeys.forEach(threshold => {

        const thresholdColor = getColorDependingOnThreshold({
            value: pollutantThresholds[threshold],
            thresholds: pollutantThresholds
        })

        const data = [
            {x: startDate, y: pollutantThresholds[threshold]},
            {x: endDate, y: pollutantThresholds[threshold]}
        ]

        const thresholdDataset = {
            label: threshold,
            data: data,
            backgroundColor: thresholdColor,
            borderColor: thresholdColor,
            showLine: true,
            pointRadius: 0,
        }

        currentDatasets.push(thresholdDataset)
    })

    const stationName = station.name
    const stationReadings = readings[station.id]
    const currentValues = []
    const dotsColors = []

    stationReadings.forEach(o => {
        const xValueA = o.timestamp
        const xValueB = o.recorded_at
        const yValueA = o[pollutantName.toLowerCase()]
        const yValueB = o[pollutantName.toUpperCase()]
        const value = {
            x: xValueA || xValueB,
            y: yValueA || yValueB,
        }

        const currentColor = getColorDependingOnThreshold({
            value: value.y,
            thresholds: pollutantThresholds
        })

        dotsColors.push(currentColor)
        currentValues.push(value)
    })

    currentDatasets.push({
        label: stationName,
        data: currentValues,
        backgroundColor: dotsColors,
        showLine: false
    })

    return currentDatasets
}
