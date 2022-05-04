import {getToken} from "../../../utils/axios";
import axios from "axios";
import {getCurrentDatasets} from "../utils";

const POLLUTANTS_BY_STATIONS = `${process.env.REACT_APP_API_URL}/api/pollutants-by-stations`


export async function getDatasets({pollutant, station, startDate, endDate}) {

    const token = getToken();

    const queryConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    console.log({pollutant, station, startDate, endDate})

    const queryData = {
        pollutants: [pollutant.name],
        stations: [station.id],
        startDate: startDate,
        endDate: endDate
    }

    const r = await axios.post(POLLUTANTS_BY_STATIONS, queryData, queryConfig)
    const { data } = r
    const { readings } = data

    return getCurrentDatasets({
        readings: readings,
        stations: [station],
        pollutantName: pollutant.name
    })
}
