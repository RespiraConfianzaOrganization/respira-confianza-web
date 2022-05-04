import {getToken} from "../../../utils/axios";
import axios from "axios";

const STATIONS_URL = `${process.env.REACT_APP_API_URL}/api/public/stations`

export async function getStationsChoices() {

    const token = getToken();

    const queryConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const r = await axios.get(STATIONS_URL, queryConfig)

    const { data } = r
    const { stations } = data

    return stations.map((station) => {
        return {
            'value': station,
            'label': station.name,
        }
    })
}


