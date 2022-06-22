import {useCallback, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {Layout} from "antd";
import moment from "moment";
import "chartjs-adapter-moment";
import {Line} from 'react-chartjs-2';
import {Chart as ChartJS, LinearScale, LineElement, PointElement, TimeScale, Title} from 'chart.js';
import {getChartPrimaryTitle, getChartSecondaryTitle, getOptions} from "./utils";
import {getDaysBetweenTwoDates} from "../../utils/chart";
import {getDatasets} from "./queries/pollutantByStation";
import {ColorExplainByPollutant} from "./ColorExplain";

ChartJS.register(LineElement, PointElement, LinearScale, Title, TimeScale);

const {Content} = Layout;


export const ChartByTime = ({station, pollutant, daysQueryBy}) => {

    const [datasets, setDatasets] = useState([]);
    const [labels, setLabels] = useState([])

    const chartRef = useRef(null);

    const endDate = moment()
    const startDate = moment().subtract(daysQueryBy, 'days')

    const endDateISO = endDate.toISOString()
    const startDateISO = startDate.toISOString()

    const loadDatasets = (datasets) => setDatasets(datasets)

    useEffect(() => {
        const daysLabels = getDaysBetweenTwoDates(startDateISO, endDateISO)
        setLabels(daysLabels)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [daysQueryBy])

    useEffect(() => {
        const datasetsConfig = {
            pollutant: pollutant,
            station: station,
            startDate: startDateISO,
            endDate: endDateISO,
            groupByTime: daysQueryBy !== 1
        }
        getDatasets(datasetsConfig).then(loadDatasets)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pollutant, station, daysQueryBy])

    let maxDate

    try {
        const interestedDataset = datasets.filter(({label}) => label === station.name)
        maxDate = interestedDataset[0].maxDate
    } catch (error) {
        maxDate = endDate.valueOf()
    }

    const chartOptions = getOptions({
        pollutantUnit: pollutant.unit,
        xScales: {
            min: startDate.valueOf(),
            max: maxDate
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

    const primaryTitle = getChartPrimaryTitle({days: daysQueryBy})
    const secondaryTitle = getChartSecondaryTitle({startDate: startDate, endDate: endDate})

    return <StyledContent>
        <h1>{primaryTitle}</h1>
        <h2>{secondaryTitle}</h2>
        <ChartPollutants />
        {pollutant?.name && <ColorExplainByPollutant
            pollutantName={pollutant.name}
        />}
    </StyledContent>
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
