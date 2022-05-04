import {getToken} from "../../utils/axios";
import axios from "axios";

const STATIONS_URL = `${process.env.REACT_APP_API_URL}/api/public/stations`

export async function getStationsChoices() {

    const token = getToken();

    const r = await axios.get(STATIONS_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const {data} = r
    const {stations} = data
    return stations.map((station) => {
        return {
            'value': station,
            'label': station.name,
        }
    })
}

const POLLUTANTS_URL = `${process.env.REACT_APP_API_URL}/api/pollutants`

export async function getPollutantsChoices() {

    const token = getToken();

    const configQuery = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const r = await axios.get(POLLUTANTS_URL, configQuery)
    const {data} = r
    const {pollutants} = data
    pollutants.sort()

    return pollutants.map((pollutant) => {
        return {
            'value': pollutant,
            'label': pollutant.name,
        }
    })
}
