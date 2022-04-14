import {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {Chart} from "react-chartjs-2";
import {Layout} from "antd";
import {getToken} from "../../utils/axios";
import axios from "axios";
import moment from "moment";
import 'chartjs-adapter-moment'

const { Content } = Layout;

const options = {
    responsive: true,
    spanGaps: true,
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

    const [ datasets, setDatasets ] = useState([]);
    const [ labels, setLabels ] = useState([])
    const chartRef = useRef(null);

    const token = getToken();

    const getStationName = (id) => {
        const [station] = stations.filter(s => s.id === id)
        return station.name
    }

    useEffect(() => {
        const baseDate = new Date(moment().toISOString())
        setLabels(range(daysQueryBy).map(offset => {
            const mutableDate = new Date()
            mutableDate.setDate(baseDate.getDate() + offset)
            return mutableDate
        }))

    }, [daysQueryBy])

    useEffect(() => {
        axios.post(POLLUTANTS_BY_STATIONS, {
            days: daysQueryBy,
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
                pollutants.forEach(({name}) => {
                    const currentValues = []
                    const filteredReadings = readings
                        .filter(({station_id}) => station_id === id)
                    filteredReadings.forEach(o => {
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
        })
        return function cleanup() {
            setDatasets([])
        }

    }, [token, pollutants, stations, daysQueryBy])

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
