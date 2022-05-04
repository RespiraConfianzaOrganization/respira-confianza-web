import {useCallback, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {Layout, Spin} from "antd";
import {getToken} from "../../utils/axios";
import axios from "axios";
import moment from "moment";
import "chartjs-adapter-moment";
import {Line} from 'react-chartjs-2';
import {Chart as ChartJS, LinearScale, LineElement, PointElement, TimeScale, Title} from 'chart.js';
import {getCurrentDatasets, getOptions} from "./utils";
import {getNDays} from "../../utils/chart";

ChartJS.register(LineElement, PointElement, LinearScale, Title, TimeScale);

const {Content} = Layout;

const POLLUTANTS_BY_STATIONS = "http://localhost:8080/api/pollutants-by-stations/"

export const ChartByTime = ({stations, pollutant, daysQueryBy}) => {

    console.log({stations, pollutant, daysQueryBy})

    const days = daysQueryBy
    const [datasets, setDatasets] = useState([]);
    const [labels, setLabels] = useState([])
    const [dataIsReady, setDataIsReady] = useState(false)
    const chartRef = useRef(null);
    const token = getToken();

    const endDate = moment()
    const startDate = moment().subtract(days, 'days')

    const endDateISO = endDate.toISOString()
    const startDateISO = startDate.toISOString()


    useEffect(() => {
        const daysLabels = getNDays({n: days})
        setLabels(daysLabels)
    }, [days])

    useEffect(() => {
        setDataIsReady(false)
        const queryData = {
            pollutants: [pollutant.name],
            stations: stations.map(({id}) => id),
            startDate: startDateISO,
            endDate: endDateISO
        }
        const queryConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        axios.post(POLLUTANTS_BY_STATIONS,
            queryData,
            queryConfig)
            .then(({data}) => {
                const readings = data.readings
                const currentDatasets = getCurrentDatasets({
                    readings: readings,
                    stations: stations,
                    pollutantName: pollutant.name
                })
                setDatasets(currentDatasets)
                setDataIsReady(true)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        token,
        pollutant,
        stations,
        days,
    ])

    const chartOptions = getOptions({
        pollutantUnit: pollutant.unit,
        xScales: {
            min: startDate.valueOf(),
            max: endDate.valueOf()
        },
    })

    const ChartPollutants = useCallback(() => <StyledChart
        data={{
            labels: labels,
            datasets: datasets
        }}
        options={chartOptions}
        ref={chartRef}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    />, [labels, datasets])

    const primaryTitle = days === 1 ?
        `Visualización de contaminantes para el último día` :
        `Visualización de contaminantes para los últimos ${days} días`

    const startDateString = moment(startDate).format('DD/MM/YYYY')
    const endDateString = moment(endDate).format('DD/MM/YYYY')

    const secondaryTitle = `Mediciones obtenidas entre ${startDateString} y ${endDateString}`

    return <>
        <StyledContent>
            <h1>{primaryTitle}</h1>
            <h2>{secondaryTitle}</h2>
            <>
                {!dataIsReady ? <Spin/> : <ChartPollutants/>}
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
