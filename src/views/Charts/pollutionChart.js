import 'chart.js/auto';
import { useEffect, useState} from "react";
import styled from 'styled-components';
import {Collapse, Layout, Select, Spin} from 'antd';
import {ChartByTime} from "./chartByTime";
import {getPollutantChoicesFromThresholds} from "./queries/pollutants";
import {getStationsChoices} from "./queries/stations";

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
        getStationsChoices().then(loadStations)
        // Pollutants
        getPollutantChoicesFromThresholds().then(loadPollutants)
    }, [])


    return <>
    <StyledLayout>
        <StyledSider>
            <div/>
            <h1>Filtros</h1>
            <Collapse>
                {stationsReady && <StyledPanel header={"Selecciona una estación"}>
                    <StyledSelect
                        defaultValue={DEFAULT_STATION_INDEX}
                        onChange={setStationIndex}>
                        {
                            stationsChoices.map((s, idx) => {
                                return <Option key={idx} value={idx}>
                                    {s.label}
                                </Option>}
                            )}
                    </StyledSelect>
                </StyledPanel>}
                {pollutantsReady && <StyledPanel header={"Selecciona un contaminante"}>
                        <StyledSelect
                            defaultValue={DEFAULT_POLLUTANT_INDEX}
                            onChange={setPollutantIndex}>
                            {
                                pollutantChoices.map((p, idx) => {
                                    return <Option key={idx} value={idx}>
                                        {p.label}
                                    </Option>}
                                )}
                        </StyledSelect>
                </StyledPanel>}
                <StyledPanel header={"Selecciona una cantidad de días"}>
                    <StyledSelect
                        defaultValue={DEFAULT_DAYS_QUERY_BY}
                        onChange={setDaysQueryBy}>
                        {
                            [1, 7, 30, 365].map((d, idx) => {
                                return <Option key={idx} value={d}>
                                    {d}
                                </Option>}
                            )}
                    </StyledSelect>
                </StyledPanel>
            </Collapse><br/>
            <div/>
        </StyledSider>
        {!(pollutantsReady && stationsReady) ? <Spin /> : <Layout>
            <ChartByTime
                station={stationsChoices[stationIndex]?.value}
                pollutant={pollutantChoices[pollutantIndex]?.value}
                daysQueryBy={daysQueryBy}
            />
        </Layout>}
    </StyledLayout>
    </>
}

export default PollutionChart;

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
  max-width: ${sizes.sideBar.width} !important;
  min-width: ${sizes.sideBar.width} !important;
  padding-top: 5vh;
  
  p, h1 {
    text-align: center;
  }
`

