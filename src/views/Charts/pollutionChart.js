import 'chart.js/auto';
import {Chart} from 'react-chartjs-2';
import {useEffect, useRef, useState} from "react";
import styled from 'styled-components';
import {Collapse, Layout, Select, Tabs} from 'antd';
import axios from "axios";
import {getToken} from "../../utils/axios";

const { Panel } = Collapse;
const { Sider, Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Fecha'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Concentración [µg/mˆ3]'
            }
        }
    }
};

const data = {
    labels: ['2022-03-24', '2022-03-25', '2022-03-26', '2022-03-27', '2022-03-28', '2022-03-29', '2022-03-30'],
    datasets: [
        {
            label: 'Quintero - MP10',
            data: [1.1, 11.5, 3.1, 4.1, 5.1, 6.1, 7.1],
            borderColor: "#3F7CAC"
        },
        {
            label: 'Quintero - MP25',
            data: [7, 6, 5, 4, 3, 2, 1],
            borderColor: "#95AFBA"
        },
        {
            label: 'Puchuncaví - MP10',
            data: [1, 3, 5, 7, 9, 11, 13],
            borderColor: "#BDC4A7"
        },
        {
            label: 'Puchuncaví - MP25',
            data: [13, 11, 9, 7, 5, 3, 1],
            borderColor: "#D5E1A3"
        },
    ],
}

const filterDataGivenLabels = (datasets, labels) => {
    return datasets.filter(dataset => labels.includes(dataset.label));
}

const STATIONS_URL = `${process.env.REACT_APP_API_URL}/api/public/stations`
const POLLUTANTS_URL = `${process.env.REACT_APP_API_URL}/api/pollutants`


const PollutionChart = () => {

    const [baseStations, setBaseStations] = useState([])
    const [basePollutants, setBasePollutants] = useState([])
    const [stations, setStations] = useState([])
    const [pollutants, setPollutants] = useState([])
    const [chartData, setChartData] = useState(data)
    const token = getToken();
    const chartRef = useRef(null);

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

    useEffect(() => {

        const currentLabels = []
        stations.forEach(stationName =>
            pollutants.forEach(pollutantName => {
            const label = `${stationName.label} - ${pollutantName.label}`;
            currentLabels.push(label);
        }));

        const datasets = filterDataGivenLabels(data.datasets, currentLabels)
        const currentData = {
            labels: data.labels,
            datasets: datasets
        }
        setChartData(currentData)
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
            <StyledContent>
                <h1>{"Visualización de contaminantes para los últimos 7 días"}</h1>
                <h2>{"Datos entre 24 de Marzo, 2022 y 30 de Marzo, 2022"}</h2>
                <StyledChart ref={chartRef} type='line' data={chartData} options={options}/>
            </StyledContent>
        </Layout>
    </StyledLayout>
}

export default PollutionChart;

const StyledContent = styled(Content)`
  padding-top: 3vh;
  text-align: center;

  h1 {
    font-size: 36px;
  }
`

const StyledChart = styled(Chart)`
  align-self: center;
  max-width: 90%;
  padding-left: 5%;
`

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
