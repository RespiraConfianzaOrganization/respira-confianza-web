import 'chart.js/auto';
import { useEffect, useState} from "react";
import styled from 'styled-components';
import {Collapse, Layout, Select, Spin} from 'antd';
import {ChartByTime} from "./chartByTime";
import {getPollutantsChoices, getStationsChoices} from "./queries";

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

const PollutionChart = () => {

    const [stationsChoices, setStationsChoices] = useState([])
    const [pollutantChoices, setPollutantChoices] = useState([])

    const [stationsReady, setStationsReady] = useState(false)
    const [pollutantsReady, setPollutantsReady] = useState(false)

    const [stationIndex, setStationIndex] = useState(0)
    const [pollutantIndex, setPollutantIndex] = useState(0)
    const [daysQueryBy, setDaysQueryBy] = useState(1)

    const handleLoadStations = (s) => {
        setStationsChoices(s)
        setStationsReady(true)
    }

    const handleLoadPollutants = (p) => {
        setPollutantChoices(p)
        setPollutantsReady(true)
    }

    useEffect(() => {
        // Stations
        getStationsChoices().then(handleLoadStations)
        // Pollutants
        getPollutantsChoices().then(handleLoadPollutants)
    }, [])


    return <>
    <StyledLayout>
        <StyledSider>
            <div/>
            <h1>Filtros</h1>
            <Collapse>
                {stationsReady && <StyledPanel header={"Selecciona una estación"}>
                    <StyledSelect
                        defaultValue={0}
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
                            defaultValue={0}
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
                        defaultValue={1}
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
                stations={[stationsChoices[stationIndex]?.value]}
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

