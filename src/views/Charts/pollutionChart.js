import 'chart.js/auto';
import {useEffect, useState} from "react";
import styled from 'styled-components';
import {Collapse, Layout, Select, Spin} from 'antd';
import {ChartByTime} from "./chartByTime";
import {getPollutantChoicesFromThresholds} from "./queries/pollutants";
import {getStationsChoices} from "./queries/stations";
import {ColorExplainByPollutant} from "./ColorExplain";

const { Panel } = Collapse;
const { Sider } = Layout;
const { Option } = Select;

const sizes = {
    sideBar: {
        width: '21vw'
    },
    sideBarItem: {
        width: '20vw'
    }
}

const DEFAULT_STATION_INDEX = 0
const DEFAULT_POLLUTANT_INDEX = 0
const DEFAULT_DAYS_QUERY_BY = 365

const PollutionChart = () => {

    const [stationsChoices, setStationsChoices] = useState([])
    const [pollutantChoices, setPollutantChoices] = useState([])

    const [stationsReady, setStationsReady] = useState(false)
    const [pollutantsReady, setPollutantsReady] = useState(false)

    const [stationIndex, setStationIndex] = useState(DEFAULT_STATION_INDEX)
    const [pollutantIndex, setPollutantIndex] = useState(DEFAULT_POLLUTANT_INDEX)
    const [daysQueryBy, setDaysQueryBy] = useState(DEFAULT_DAYS_QUERY_BY)

    const loadStations = (s) => {
        setStationsChoices(s)
        setStationsReady(true)
    }

    const loadPollutants = (p) => {
        setPollutantChoices(p)
        setPollutantsReady(true)
    }

    useEffect(() => {
        // Stations
        setStationsReady(false)
        getStationsChoices()
            .then(loadStations)
            .catch(() => setStationsReady(true))
        // Pollutants
        setPollutantsReady(false)
        getPollutantChoicesFromThresholds()
            .then(loadPollutants)
            .catch(() => setPollutantsReady(true))
    }, [])


    return <>
    <StyledLayout>
        <ChartFilters
            stationsChoices={stationsChoices}
            stationsOnChange={setStationIndex}
            pollutantsChoices={pollutantChoices}
            pollutantsOnChange={setPollutantIndex}
            daysChoices={[1, 7, 30, 365]}
            daysOnChange={setDaysQueryBy}
        />
        {!(pollutantsReady && stationsReady) ? <Spin /> : <Layout>
            <ChartByTime
                station={stationsChoices[stationIndex]?.value}
                pollutant={pollutantChoices[pollutantIndex]?.value}
                daysQueryBy={daysQueryBy}
            />
            <ColorExplainByPollutant
                pollutantName={pollutantChoices[pollutantIndex]?.value?.name}
            />
        </Layout>}
    </StyledLayout>
    </>
}

export default PollutionChart;

const ChartFilters = ({
    stationsChoices,
    stationsOnChange,
    pollutantsChoices,
    pollutantsOnChange,
    daysChoices,
    daysOnChange,
    }) => {

    const isAuthenticated = localStorage.getItem("access_token") && true

    return <StyledSider
        needsmarginleft={isAuthenticated}
    >
        <div/>
        <h1>Filtros</h1>
        <Collapse>
            <StyledPanel header={"Selecciona una estación"}>
                <StyledSelect
                    defaultValue={DEFAULT_STATION_INDEX}
                    onChange={stationsOnChange}>
                    {
                        stationsChoices.map((s, idx) =>
                            <Option key={idx} value={idx}>
                                {s.label}
                            </Option>
                        )
                    }
                </StyledSelect>
            </StyledPanel>
            <StyledPanel header={"Selecciona un contaminante"}>
                <StyledSelect
                    defaultValue={DEFAULT_POLLUTANT_INDEX}
                    onChange={pollutantsOnChange}>
                    {
                        pollutantsChoices.map((p, idx) =>
                            <Option key={idx} value={idx}>
                                {p.label}
                            </Option>
                        )
                    }
                </StyledSelect>
            </StyledPanel>
            <StyledPanel header={"Selecciona una cantidad de días"}>
                <StyledSelect
                    defaultValue={DEFAULT_DAYS_QUERY_BY}
                    onChange={daysOnChange}>
                    {
                        daysChoices.map((d, idx) =>
                            <Option key={idx} value={d}>
                                {d}
                            </Option>
                        )
                    }
                </StyledSelect>
            </StyledPanel>
        </Collapse><br/>
        <div/>
    </StyledSider>
}

const StyledSelect = styled(Select)`
  min-width: 100%;
`

const StyledLayout = styled(Layout)`
  height: 95vh;
`

const StyledPanel = styled(Panel)`
  width: ${sizes.sideBarItem.width};
`

const StyledSider = styled(Sider)`
  display: flex;
  align-items: center;
  flex-direction: column;
  align-content: center;
  background-color: white;
  margin-left: ${props => !props.needsmarginleft ? '0px' : '60px'};
  max-width: ${sizes.sideBar.width} !important;
  min-width: ${sizes.sideBar.width} !important;
  padding-top: 5vh;
  
  p, h1 {
    text-align: center;
  }
`

