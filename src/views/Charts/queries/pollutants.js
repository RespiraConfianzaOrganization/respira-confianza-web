import axios from "axios";
import {getToken} from "../../../utils/axios";

const POLLUTANTS_URL = `${process.env.REACT_APP_API_URL}/api/pollutants`

export async function getPollutantsChoices() {

    const token = getToken();

    const queryConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const r = await axios.get(POLLUTANTS_URL, queryConfig)

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
