import {getRequest} from "../../../utils/axios";

const POLLUTANTS_URL = `${process.env.REACT_APP_API_URL}/api/pollutants`

export async function getPollutantsChoices() {

    const r = await getRequest(POLLUTANTS_URL, {})

    const {pollutants} = r?.data

    pollutants.sort()

    return pollutants.map((pollutant) => {
        return {
            'value': pollutant,
            'label': pollutant.name,
        }
    })
}
