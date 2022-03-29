import 'chart.js/auto';
import {Chart} from 'react-chartjs-2';
import {useEffect, useState} from "react";
import styled from 'styled-components';
import { Select } from 'antd';
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;

const baseStations = ['Quintero', 'Puchuncaví']
const basePollutants = ['MP10', 'MP25']

const data = {
    labels: ['2022-03-24', '2022-03-25', '2022-03-26', '2022-03-27', '2022-03-28', '2022-03-29', '2022-03-30'],
    datasets: [
        {
            label: 'Quintero - MP10',
            data: [1, 2, 3, 4, 5, 6, 7],
        },
        {
            label: 'Quintero - MP25',
            data: [7, 6, 5, 4, 3, 2, 1],
        },
        {
            label: 'Puchuncaví - MP10',
            data: [1, 3, 5, 7, 9, 11, 13],
        },
        {
            label: 'Puchuncaví - MP25',
            data: [13, 11, 9, 7, 5, 3, 1],
        },
    ],
}

const filterDataGivenLabels = (datasets, labels) => {
    return datasets.filter(dataset => labels.includes(dataset.label));
}

const PollutionChart = () => {
    const [stations, setStations] = useState(baseStations)
    const [pollutants, setPollutants] = useState(basePollutants)
    const [chartData, setChartData] = useState(data)

    useEffect(() => {
        const currentLabels = []
        stations.forEach(stationName =>
            pollutants.forEach(pollutantName => {
            const label = `${stationName} - ${pollutantName}`;
            currentLabels.push(label);
        }));
        const datasets = filterDataGivenLabels(data.datasets, currentLabels)
        const currentData = {
            labels: data.labels,
            datasets: datasets
        }
        setChartData(currentData)
    }, [stations, pollutants])

    return <Layout>
        <Layout>
            <StyledSider>
                <>
                <p>Estaciones</p>
                <StyledSelect
                    mode="multiple"
                    placeholder="Selecciona algunas estaciones"
                    onChange={(value) => setStations(value)}
                    optionLabelProp="label"
                >
                    {baseStations.map(station =>
                        <Option value={station} label={station}>
                            <div>
                                {station}
                            </div>
                        </Option>
                    )}
                </StyledSelect>
                </>
                <>
                <p>Contaminantes</p>
                <StyledSelect
                    mode="multiple"
                    placeholder="Selecciona algunos contaminantes"
                    onChange={(value) => setPollutants(value)}
                    optionLabelProp="label"
                >
                    {basePollutants.map(pollutant =>
                        <Option value={pollutant} label={pollutant}>
                            <div>
                                {pollutant}
                            </div>
                        </Option>
                    )}
                </StyledSelect>
                </>
            </StyledSider>
            <Content>
                <Chart type='line' data={chartData} />
            </Content>
        </Layout>
    </Layout>
}

export default PollutionChart;

const StyledSelect = styled(Select)`
  width: 15vw;
`

const StyledSider = styled(Sider)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  min-width: 18vw !important;
  
  p {
    text-align: center;
  }
`
