import 'chart.js/auto';
import {useEffect, useState} from "react";
import styled from 'styled-components';
import {Collapse, Layout, Select, Tabs} from 'antd';
import axios from "axios";
import {getToken} from "../../utils/axios";
import {ChartByTime} from "./chartByTime";

const { Panel } = Collapse;
const { Sider } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

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

    const [baseStations, setBaseStations] = useState([])
    const [basePollutants, setBasePollutants] = useState([])
    const [stations, setStations] = useState([])
    const [pollutants, setPollutants] = useState([])
    const [dataIsReady, setDataIsReady] = useState(false)
    const token = getToken();

    useEffect(() => {
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
            setBaseStations(currentBaseStations)
            setStations(currentBaseStations.map(s => s.value))
        })

    }, [token])

    useEffect(() => {
        axios.get(POLLUTANTS_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((r) => {
            const pollutants = r.data.pollutants
            console.log(pollutants)
            const currentBasePollutants = pollutants.map( (pollutant) => {
                return {
                    'value': pollutant,
                    'label': pollutant.name,
                }
            })
            setBasePollutants(currentBasePollutants)
            setPollutants(currentBasePollutants.map(p => p.value))
        })

    }, [token])

    useEffect(() => {
        const isReady = pollutants.length > 0 && stations.length > 0 && true
        setDataIsReady(isReady)
    }, [pollutants, stations])

    const SelectIterable = [
        {
            "placeholder": "Selecciona algunas estaciones",
            "defaultValue": baseStations,
            "options": baseStations,
            "cardName": "Estaciones",
            "onChange": setStations
        },
        {
            "placeholder": "Selecciona algunos contaminantes",
            "defaultValue": basePollutants,
            "options": basePollutants,
            "cardName": "Contaminantes",
            "onChange": setPollutants
        }
    ]


    const tabs = [
        {daysQueryBy: 1, title: "Ultimo día"},
        {daysQueryBy: 7, title: "Ultimo semana"},
        {daysQueryBy: 30, title: "Ultimo mes"},
        {daysQueryBy: 365, title: "Ultimo año"},
    ]

    return <StyledLayout>
        <StyledSider>
            <div/>
            <h1>Filtros</h1>
            <Collapse>
                {SelectIterable.map((s, idx) =>
                    <StyledPanel header={s.cardName} key={idx}>
                        <StyledSelect
                            mode="multiple"
                            placeholder={s.placeholder}
                            onChange={s.onChange}
                            optionLabelProp="label"
                            defaultValue={s.defaultValue}
                        >
                            {s.options.map((option, idx) =>
                                <Option value={option.value} label={option.label} key={idx}>
                                    <div>
                                        {option.label}
                                    </div>
                                </Option>
                            )}
                        </StyledSelect>
                    </StyledPanel>
                )}
            </Collapse>
            <div/>
        </StyledSider>
        <Layout>
            <Tabs type={"card"} centered={true}>
                {tabs.map(({daysQueryBy, title}, idx) =>
                    <TabPane tab={title} key={idx}>
                        {dataIsReady && <ChartByTime
                        stations={stations}
                        pollutants={pollutants}
                        daysQueryBy={daysQueryBy}
                    />}
                </TabPane>)}
            </Tabs>

        </Layout>
    </StyledLayout>
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
