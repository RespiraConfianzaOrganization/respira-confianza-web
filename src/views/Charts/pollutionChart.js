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



const STATIONS_URL = `${process.env.REACT_APP_API_URL}/api/public/stations`
const POLLUTANTS_URL = `${process.env.REACT_APP_API_URL}/api/pollutants`


const PollutionChart = () => {

    const [baseStations, setBaseStations] = useState([])
    const [basePollutants, setBasePollutants] = useState([])
    const [stations, setStations] = useState([])
    const [pollutants, setPollutants] = useState([])
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
                    'value': station.id,
                    'label': station.name
                }
            })
            setBaseStations(currentBaseStations)
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
            const currentBasePollutants = pollutants.map( (station) => {
                return {
                    'value': station.name,
                    'label': station.extendedName
                }
            })
            setBasePollutants(currentBasePollutants)
        })

    }, [token])

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
                            {s.options.map(option =>
                                <Option value={option.value} label={option.label}>
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
            <Tabs defaultActiveKey={"1"} type={"card"}>
                <TabPane tab={"Ultimo día"} key={"1"}>
                    <ChartByTime
                        stations={stations}
                        pollutants={pollutants}
                        principalTitle={"Visualización de contaminantes para el último día"}
                        secondaryTitle={"Datos entre 7 de Abril, 2022 y 8 de Abril, 2022"}
                        daysQueryBy={1}
                    />
                </TabPane>
                <TabPane tab={"Ultima semana"} key={"2"}>
                    <ChartByTime
                        stations={stations}
                        pollutants={pollutants}
                        principalTitle={"Visualización de contaminantes para los últimos 7 días"}
                        secondaryTitle={"Datos entre 31 de Marzo, 2022 y 7 de Abril, 2022"}
                        daysQueryBy={7}
                    />
                </TabPane>
                <TabPane tab={"Ultimos 30 días"} key={"3"}>
                    <ChartByTime
                        stations={stations}
                        pollutants={pollutants}
                        principalTitle={"Visualización de contaminantes para los últimos 30 días"}
                        secondaryTitle={"Datos entre 7 de Marzo, 2022 y 7 de Abril, 2022"}
                        daysQueryBy={30}
                    />
                </TabPane>
                <TabPane tab={"Ultimos 365 días"} key={"4"}>
                    <ChartByTime
                        stations={stations}
                        pollutants={pollutants}
                        principalTitle={"Visualización de contaminantes para los últimos 365 días"}
                        secondaryTitle={"Datos entre 7 de Abril, 2021 y 7 de Abril, 2022"}
                        daysQueryBy={365}
                    />
                </TabPane>

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
  width: 15vw;
`

const StyledSider = styled(Sider)`
  display: flex;
  align-items: center;
  flex-direction: column;
  align-content: center;
  background-color: white;
  min-width: 18vw !important;
  padding-top: 5vh;
  
  p, h1 {
    text-align: center;
  }
`
