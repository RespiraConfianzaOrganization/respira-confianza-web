import {postRequest} from "../../../utils/axios";
import {getCurrentDatasets} from "../utils";
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

    return getCurrentDatasets({
        readings: readings,
        stations: [station],
        pollutantName: pollutant.name,
        thresholds: pollutantThresholds,
        startDate: startDate,
        endDate: endDate
    })
}
