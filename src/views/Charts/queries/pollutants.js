import {getRequest} from "../../../utils/axios";


const pollutantChoicesFromModel = pollutants => {
    return pollutants.map((pollutant) => {
        return {
            'value': pollutant,
            'label': pollutant.name,
        }
    })
}


const POLLUTANTS_URL = `${process.env.REACT_APP_API_URL}/api/pollutants`

export async function getPollutantsChoices() {

    const r = await getRequest(POLLUTANTS_URL, {})

    const {pollutants} = r?.data

    pollutants.sort()

    return pollutantChoicesFromModel(pollutants)
}

const THRESHOLDS_URL = `${process.env.REACT_APP_API_URL}/api/pollutant-umbrals`

export async function getPollutantChoicesFromThresholds() {

    const { data } = await getRequest(THRESHOLDS_URL, {})

    const { pollutantUmbrals } = data

    const pollutants = pollutantUmbrals.map(p => p.Pollutant)

    return pollutantChoicesFromModel(pollutants)

}
