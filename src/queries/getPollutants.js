import {getRequest} from "../utils/axios";

const STATIONS_URL = `${process.env.REACT_APP_API_URL}/api/public/stations`

export const getStations = async () => {
    const r = await getRequest(STATIONS_URL, {})
    const {stations} = r?.data
    return stations
}
