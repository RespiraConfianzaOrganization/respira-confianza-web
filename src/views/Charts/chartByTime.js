import {useEffect, useState, useCallback, useRef} from "react";
import styled from "styled-components";
import {Layout, Spin} from "antd";
import {getToken} from "../../utils/axios";
import axios from "axios";
import moment from "moment";
import "chartjs-adapter-moment";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, TimeScale } from 'chart.js';
import {getOptions, getRandomColor} from "./utils";
import {usePost} from "./hooks";

ChartJS.register(LineElement, PointElement, LinearScale, Title, TimeScale);

const { Content } = Layout;

const POLLUTANTS_BY_STATIONS = "http://localhost:8080/api/pollutants-by-stations/"

const range = n => [...Array(n).keys()]

export const ChartByTime = ({stations, pollutant, daysQueryBy}) => {

    const days = daysQueryBy
    const [ datasets, setDatasets ] = useState([]);
    const [ labels, setLabels ] = useState([])
    const [ dataIsReady, setDataIsReady ] = useState(false)
    const chartRef = useRef(null);
    const token = getToken();

    const endDate = moment()
    const startDate = moment().subtract(days, 'days')

    const endDateISO = endDate.toISOString()
    const startDateISO = startDate.toISOString()

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
            pollutants: [pollutant.name],
            stations: stations.map(({id}) => id),
            startDate: startDateISO,
            endDate: endDateISO
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(({data}) => {
            const readings = data.readings
            const currentDatasets = []
            stations.forEach(({id}) => {
                const stationName = getStationName(id)
                const stationReadings = readings[id]
                const currentValues = []
                const pollutantName = pollutant.name
                stationReadings.forEach(o => {
                    const value = {
                        x: o.timestamp,
                        y: o[pollutantName.toLowerCase()]
                    }
                    currentValues.push(value)
                })
                currentDatasets.push({
                    label: stationName,
                    data: currentValues,
                    backgroundColor: getRandomColor()
                })
            })
            setDatasets(currentDatasets)
            setDataIsReady(true)
        })

    }, [
        token,
        pollutant,
        stations,
        days,
        getStationName,
    ])

    const ChartPollutants = useCallback(() => <StyledChart
        data={{
            labels: labels,
            datasets: datasets
        }}
        options={getOptions({pollutantUnit: pollutant.name})}
        ref={chartRef}
    />, [labels, datasets])

    const primaryTitle = days === 1 ?
        `Visualización de contaminantes para el último día` :
        `Visualización de contaminantes para los últimos ${days} días`

    const secondaryTitle = `Datos entre ${startDate.format('yyyy-mm-DD')} y ${endDate.format('yyyy-mm-DD')}`

    return <>
        <StyledContent>
            <h1>{primaryTitle}</h1>
            <h2>{secondaryTitle}</h2>
            <>
                {dataIsReady ? <Spin /> : <ChartPollutants />}
            </>
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
