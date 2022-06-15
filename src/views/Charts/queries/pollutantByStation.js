import {getRequest, postRequest} from "../../../utils/axios";
import {getCurrentDatasets} from "../utils";

const POLLUTANTS_BY_STATIONS = `${process.env.REACT_APP_API_URL}/api/pollutants-by-stations`

const THRESHOLDS_URL = `${process.env.REACT_APP_API_URL}/api/pollutant-umbrals/pollutant/:pollutant`

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

    const POLLUTANT_THRESHOLDS_URL = THRESHOLDS_URL.replace(':pollutant', pollutantName)
    const thresholdsResponse = await getRequest(POLLUTANT_THRESHOLDS_URL, {})
    const {pollutantUmbrals} = thresholdsResponse?.data

    return getCurrentDatasets({
        readings: readings,
        stations: [station],
        pollutantName: pollutant.name,
        thresholds: pollutantUmbrals,
    })
}
