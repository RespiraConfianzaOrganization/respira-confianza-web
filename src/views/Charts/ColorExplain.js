import {getThresholdsByPollutant} from "./queries/thresholds";
import {useEffect, useState} from "react";
import styled from "styled-components";

export const ColorExplainByPollutant = ({pollutantName}) => {

    const [thresholdData, setThresholdData] = useState({})

    useEffect(() => {
        getThresholdsByPollutant(pollutantName)
            .then(setThresholdData)
    }, [pollutantName])

    const {
        good,
        moderate,
        unhealthy,
        very_unhealthy,
        dangerous,
        Pollutant
    } = thresholdData

    const isLoaded = Object.keys(thresholdData).length > 0

    return !isLoaded ? null : <InfoContainer>
        <ul>
            <li>Menor a {good} ({Pollutant.unit})</li>
            <li>Entre {good} ({Pollutant.unit}) y {moderate} ({Pollutant.unit})</li>
            <li>Entre {moderate} ({Pollutant.unit}) y {unhealthy} ({Pollutant.unit})</li>
        </ul>
        <ul>
            <li>Entre {unhealthy} ({Pollutant.unit}) y {very_unhealthy} ({Pollutant.unit})</li>
            <li>Entre {very_unhealthy} ({Pollutant.unit}) y {dangerous} ({Pollutant.unit})</li>
            <li>Mayor a {dangerous} ({Pollutant.unit})</li>
        </ul>
    </InfoContainer>
}

const InfoContainer = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
`
