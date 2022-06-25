import {postRequest} from "../../../utils/axios";
import {getColorDependingOnThreshold} from "../utils";
import {getThresholdsByPollutant} from "./thresholds";
import moment from "moment";

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

    const stationName = station.name
    const stationReadings = readings[station.id]
    const stationValues = []
    const dotsColors = []

    let maxDate = startDate

    stationReadings.forEach(o => {
        const xValueA = o.timestamp
        const xValueB = o.recorded_at
        const yValueA = o[pollutantName.toLowerCase()]
        const yValueB = o[pollutantName.toUpperCase()]
        const x = xValueA || xValueB
        const y = yValueA || yValueB
        const value = {x, y}

        const currentColor = getColorDependingOnThreshold({
            value: y,
            thresholds: pollutantThresholds
        })

        dotsColors.push(currentColor)
        stationValues.push(value)

        const currentValueIsNewer = moment(x).diff(moment(maxDate), 'seconds') > 0

        maxDate = currentValueIsNewer ? x : maxDate

    })

    const stationHasValues = stationValues.length > 0

    maxDate = stationHasValues ? maxDate : endDate

    thresholdsKeys.forEach(threshold => {

        const thresholdColor = getColorDependingOnThreshold({
            value: pollutantThresholds[threshold],
            thresholds: pollutantThresholds
        })

        const data = [
            {x: startDate, y: pollutantThresholds[threshold]},
            {x: maxDate, y: pollutantThresholds[threshold]}
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

    currentDatasets.push({
        label: stationName,
        data: stationValues,
        backgroundColor: dotsColors,
        showLine: false,
        maxDate
    })

    return currentDatasets
}
