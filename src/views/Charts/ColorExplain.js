import {getThresholdsByPollutant} from "./queries/thresholds";
import {useEffect, useState} from "react";

export const ColorExplainByPollutant = ({pollutantName}) => {
    const [thresholdData, setThresholdData] = useState({})

    useEffect(() => {
        getThresholdsByPollutant(pollutantName)
            .then(setThresholdData)
    }, [pollutantName])

    const {good, moderate, unhealthy, very_unhealthy, dangerous} = thresholdData

    return null
}
