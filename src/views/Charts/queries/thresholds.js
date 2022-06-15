import {getRequest} from "../../../utils/axios";

const THRESHOLDS_URL = `${process.env.REACT_APP_API_URL}/api/pollutant-umbrals/pollutant/:pollutant`

export async function getThresholdsByPollutant(pollutantName) {

    const POLLUTANT_THRESHOLDS_URL = THRESHOLDS_URL.replace(':pollutant', pollutantName)
    const thresholdsResponse = await getRequest(POLLUTANT_THRESHOLDS_URL, {})
    const {pollutantUmbrals} = thresholdsResponse?.data
    return pollutantUmbrals

}


