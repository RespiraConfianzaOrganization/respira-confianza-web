import {getRequest} from "../../../utils/axios";

const STATIONS_URL = `${process.env.REACT_APP_API_URL}/api/public/stations`

export async function getStationsChoices() {

    const r = await getRequest(STATIONS_URL, {})

    const {stations} = r?.data

    return stations.map((station) => {
        return {
            'value': station,
            'label': station.name,
        }
    })
}


