import {getThresholdsByPollutant} from "./queries/thresholds";
import {useEffect, useState} from "react";
import styled from "styled-components";
import {colors} from "../../Constants";

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
            <ListItem color={colors.LessThanGood}>
                Menor a {good} ({Pollutant.unit})
            </ListItem>
            <ListItem color={colors.BetweenGoodAndModerate}>
                Entre {good} ({Pollutant.unit}) y {moderate} ({Pollutant.unit})
            </ListItem>
            <ListItem color={colors.BetweenModerateAndUnhealthy}>
                Entre {moderate} ({Pollutant.unit}) y {unhealthy} ({Pollutant.unit})
            </ListItem>
            <ListItem color={colors.BetweenUnhealthyAndVeryUnhealthy}>
                Entre {unhealthy} ({Pollutant.unit}) y {very_unhealthy} ({Pollutant.unit})
            </ListItem>
            <ListItem color={colors.BetweenVeryUnhealthyAndDangerous}>
                Entre {very_unhealthy} ({Pollutant.unit}) y {dangerous} ({Pollutant.unit})
            </ListItem>
            <ListItem color={colors.MoreThanDangerous}>
                Mayor a {dangerous} ({Pollutant.unit})
            </ListItem>
        </ul>

    </InfoContainer>
}

const InfoContainer = styled.div`
  ul {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
  }
  
`

const ListItem = styled.li`
  display: inline-list-item;
  padding-left: -1em;

  &::marker {
    color: ${props => props.color || "black"};
  }
`
