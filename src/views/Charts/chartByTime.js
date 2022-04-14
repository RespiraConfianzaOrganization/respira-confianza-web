import {useEffect, useRef, useState, useCallback} from "react";
import styled from "styled-components";
import {Layout} from "antd";
import {getToken} from "../../utils/axios";
import axios from "axios";
import moment from "moment";
import {Skeleton} from "antd";
import "chartjs-adapter-moment";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, TimeScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, TimeScale);

const { Content } = Layout;

const options = {
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
            },
            type: 'timeseries',
            time: {
                'unit': 'month'
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

const POLLUTANTS_BY_STATIONS = "http://localhost:8080/api/pollutants-by-stations/"

const range = n => [...Array(n).keys()]

export const ChartByTime = ({stations, pollutants, principalTitle, secondaryTitle, daysQueryBy}) => {

    const days = daysQueryBy
    const [ datasets, setDatasets ] = useState([]);
    const [ labels, setLabels ] = useState([])
    const [ dataIsReady, setDataIsReady ] = useState(false)
    // const chartRef = useRef(null);

    const token = getToken();

    const getStationName = useCallback((id) => {
        const [station] = stations.filter(s => s.id === id)
        return station.name
    }, [stations])

    useEffect(() => {
        const baseDate = new Date(moment().toISOString())
        setLabels(range(days).map(offset => {
            const mutableDate = new Date()
            mutableDate.setDate(baseDate.getDate() + offset)
            return mutableDate
        }))

    }, [days])

    useEffect(() => {

        setDataIsReady(false)

        axios.post(POLLUTANTS_BY_STATIONS, {
            days: days,
            pollutants: pollutants.map(({name}) => name),
            stations: stations.map(({id}) => id)
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((r) => {
            const readings = r.data.readings
            const currentDatasets = []
            stations.forEach(({id}) => {
                const stationName = getStationName(id)
                const stationReadings = readings[id]
                pollutants.forEach(({name}) => {
                    const currentValues = []
                    stationReadings.forEach(o => {
                        const date = new Date(o.recorded_at)
                        const value = {
                            x: date,
                            y: o[name]
                        }
                        currentValues.push(value)
                    })
                    currentDatasets.push({
                        label: `${stationName} - ${name}`,
                        data: currentValues
                    })
                })
            })
            setDatasets(currentDatasets)
            setDataIsReady(true)
        })
        return function cleanup() {
            setDatasets([])
        }

    }, [token, pollutants, stations, days, getStationName])

    return <>
        <StyledContent>
            <h1>{principalTitle}</h1>
            <h2>{secondaryTitle}</h2>
            <StyledChart
              data={{
                labels: labels,
                datasets: datasets
              }}
              options={options}
            />
        </StyledContent>
    </>
}

const StyledChart = styled(Line)`
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
