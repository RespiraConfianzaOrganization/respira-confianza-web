import {getToken} from "../../utils/axios";
import axios from "axios";

const STATIONS_URL = `${process.env.REACT_APP_API_URL}/api/public/stations`
const POLLUTANTS_URL = `${process.env.REACT_APP_API_URL}/api/pollutants`

const token = getToken();

export async function getStationsChoices() {

    const queryConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const r = await axios.get(STATIONS_URL, queryConfig)

    const {data} = r
    const {stations} = data

    return stations.map((station) => {
        return {
            'value': station,
            'label': station.name,
        }
    })
}


export async function getPollutantsChoices() {

    const queryConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const r = await axios.get(POLLUTANTS_URL, queryConfig)

    const { data } = r
    const { pollutants } = data

    pollutants.sort()

    return pollutants.map((pollutant) => {
        return {
            'value': pollutant,
            'label': pollutant.name,
        }
    })
}
