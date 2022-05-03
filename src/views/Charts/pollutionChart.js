import 'chart.js/auto';
import {useCallback, useEffect, useState} from "react";
import styled from 'styled-components';
import {Collapse, Layout, Select} from 'antd';
import axios from "axios";
import {getToken} from "../../utils/axios";
import {ChartByTime} from "./chartByTime";

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

const STATIONS_URL = `${process.env.REACT_APP_API_URL}/api/public/stations`
const POLLUTANTS_URL = `${process.env.REACT_APP_API_URL}/api/pollutants`


const PollutionChart = () => {

    const [stationsChoices, setStationsChoices] = useState([])
    const [pollutantChoices, setPollutantChoices] = useState([])

    const [stationsReady, setStationsReady] = useState(false)
    const [pollutantsReady, setPollutantsReady] = useState(false)
    const [dataIsReady, setDataIsReady] = useState(false)

    const [stations, setStations] = useState([])
    const [polluntantIndex, setPolluntantIndex] = useState(null)
    const [daysQueryBy, setDaysQueryBy] = useState(365)


    const token = getToken();

    useEffect(() => {

        setStationsReady(false)

        axios.get(STATIONS_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((r) => {
            const stations = r.data.stations
            const currentBaseStations = stations.map( (station) => {
                return {
                    'value': station,
                    'label': station.name,
                }
            })
            setStationsChoices(currentBaseStations)
            setStations(currentBaseStations.map(s => s.value))
        })

        setStationsReady(true)

    }, [token])

    useEffect(() => {
        setPollutantsReady(false)

        axios.get(POLLUTANTS_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((r) => {
            const pollutants = r?.data?.pollutants ?? []
            pollutants.sort()
            const currentBasePollutants = pollutants.map( (pollutant) => {
                return {
                    'value': pollutant,
                    'label': pollutant.name,
                }
            })
            setPollutantChoices(currentBasePollutants)
        })

        setPollutantsReady(true)

    }, [token])

    useEffect(() => {
        const isReady = pollutantsReady && stationsReady
        setDataIsReady(isReady)
    }, [pollutantsReady, stationsReady])

    const ChartByTimeCallback = useCallback(() => {
        const pollutant = pollutantChoices[polluntantIndex]?.value
        return !dataIsReady ? null : <ChartByTime
            stations={stations}
            pollutant={pollutant}
            daysQueryBy={daysQueryBy}
        />
    }, [stations, polluntantIndex, daysQueryBy, dataIsReady, pollutantChoices])

    return <>
    <StyledLayout>
        <StyledSider>
            <div/>
            <h1>Filtros</h1>
            <Collapse>
                <StyledPanel header={"Selecciona algunas estaciones"}>
                    <StyledSelect
                        mode="multiple"
                        placeholder={"Selecciona algunas estaciones"}
                        onChange={setStations}
                        optionLabelProp="label"
                        defaultValue={stationsChoices}
                    >
                        {stationsReady && stationsChoices.map((option, idx) =>
                            <Option value={option.value} label={option.label} key={idx}>
                                <div>
                                    {option.label}
                                </div>
                            </Option>
                        )}
                    </StyledSelect>
                </StyledPanel>
                {pollutantsReady && <StyledPanel header={"Selecciona un contaminante"}>
                        <StyledSelect onChange={setPolluntantIndex}>
                            {
                                pollutantChoices.map((p, idx) => {
                                    return <Option key={idx} value={idx}>
                                        {p.label}
                                    </Option>}
                                )}
                        </StyledSelect>
                </StyledPanel>}
            </Collapse>
            <div/>
        </StyledSider>
        <Layout>
            {!polluntantIndex ? null : <ChartByTimeCallback />}
        </Layout>
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
