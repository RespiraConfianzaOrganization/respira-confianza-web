import {postRequest} from "../../../utils/axios";
import {getCurrentDatasets} from "../utils";

const POLLUTANTS_BY_STATIONS = `${process.env.REACT_APP_API_URL}/api/pollutants-by-stations`


export async function getDatasets({pollutant, station, startDate, endDate, groupByTime}) {

    const queryData = {
        pollutants: [pollutant.name],
        stations: [station.id],
        startDate: startDate,
        endDate: endDate,
        groupByTime: groupByTime
    }

    const r = await postRequest(POLLUTANTS_BY_STATIONS, queryData)
    const {readings} = r?.data

    return getCurrentDatasets({
        readings: readings,
        stations: [station],
        pollutantName: pollutant.name
    })
}
