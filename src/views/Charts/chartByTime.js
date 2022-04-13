import {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {Chart} from "react-chartjs-2";
import {Layout} from "antd";

const { Content } = Layout;

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

export const ChartByTime = ({stations, pollutants, principalTitle, secondaryTitle, daysQueryBy}) => {

    const [ datasets, setDatasets ] = useState([]);
    const [ labels, setLabels ] = useState([])
    const chartRef = useRef(null);

    useEffect(() => {
        console.log('xd')
    }, [])

    return <>
        <StyledContent>
            <h1>{principalTitle}</h1>
            <h2>{secondaryTitle}</h2>
            <StyledChart
                ref={chartRef}
                type='line'
                data={{
                    labels: labels,
                    datasets: datasets
                }}
                options={options}
            />
        </StyledContent>
    </>
}

const StyledChart = styled(Chart)`
  align-self: center;
  max-width: 90%;
  padding-left: 5%;
`

const StyledContent = styled(Content)`
  padding-top: 3vh;
  text-align: center;

  h1 {
    font-size: 36px;
  }
`
