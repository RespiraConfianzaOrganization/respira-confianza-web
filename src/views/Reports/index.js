import {useCallback, useEffect, useState} from "react";
import {getStationsChoices} from "../Charts/queries/stations";
import {getPollutantChoicesFromThresholds} from "../Charts/queries/pollutants";
import {Button, DatePicker, Form, Select, Spin, message} from 'antd';
import {postRequest} from "../../utils/axios";
import {saveAs} from 'file-saver'
import moment from "moment";
import styled from "styled-components";
import {validateDatePicker, validateChoices} from "./validators";

const {RangePicker} = DatePicker
const {Option} = Select;

message.config({
    top: 65
})

const REPORT_URL = `${process.env.REACT_APP_API_URL}/api/reports/exceed-threshold`

const DEFAULT_STATION_INDEX = 0
const DEFAULT_POLLUTANT_INDEX = 0

export const ExceedAirQuality = () => {
    const [stationsChoices, setStationsChoices] = useState([])
    const [pollutantChoices, setPollutantChoices] = useState([])

    const [stationIndex, setStationIndex] = useState(DEFAULT_STATION_INDEX)
    const [pollutantIndex, setPollutantIndex] = useState(DEFAULT_POLLUTANT_INDEX)

    const [loading, setLoading] = useState(false)

    const loadStations = stations => {
        setStationsChoices(stations)
    }

    const loadPollutants = pollutants => {
        setPollutantChoices(pollutants)
    }

    useEffect(() => {
        // Stations
        getStationsChoices().then(loadStations)
        // Pollutants
        getPollutantChoicesFromThresholds().then(loadPollutants)
    }, [])

    const handlePollutantOnChange = i => {
        setPollutantIndex(i)
    }
    const handleStationOnChange = i => {
        setStationIndex(i)
    }

    const handleFormErrors = async (error) => {
        const data = error.response.data
        const decodedData = new TextDecoder().decode(data)
        const jsonErrors = JSON.parse(decodedData)
        const errors = jsonErrors.errors || {}

        setLoading(false)

        for (const field of Object.keys(errors)) {
            const fieldErrors = errors[field]
            for (const fieldError of fieldErrors) {
                const content = `${field}: ${fieldError}`
                await message.error(content)
            }
        }
    }

    const downloadPDF = response => {
        const { data } = response
        const blob = new Blob([data], {type: 'application/pdf'})
        setLoading(false)
        saveAs(blob, 'reporte.pdf')
    }

    const sendForm = inputData => {
        setLoading(true)
        postRequest(REPORT_URL, inputData, "arraybuffer")
            .then(downloadPDF)
            .catch(handleFormErrors)
    }

    const onFinish = ({dateRange}) => {

        const [startDate, endDate] = dateRange
        const {name} = pollutantChoices[pollutantIndex]['value']
        const {id} = stationsChoices[stationIndex]['value']

        const now = moment().format('YYYY-MM-DD').toString()

        const data = {
            startDate: startDate.format('YYYY-MM-DD').toString(),
            endDate: endDate.format('YYYY-MM-DD').toString(),
            pollutant: name,
            station: id,
            requestDate: now
        }

        sendForm(data)
    }

    const StationChoices = useCallback(() => {
        return <Select
            defaultValue={DEFAULT_STATION_INDEX}
            onChange={handleStationOnChange}>
            {stationsChoices.map(({label}, idx) => {
                return <Option key={idx} value={idx}>
                    {label}
                </Option>
            })}
        </Select>
    }, [stationsChoices])

    const PollutantsChoices = useCallback(() => {
        return <Select
            defaultValue={DEFAULT_POLLUTANT_INDEX}
            onChange={handlePollutantOnChange}>
            {pollutantChoices.map(({label}, idx) => {
                return <Option key={idx} value={idx}>
                    {label}
                </Option>
            })}
        </Select>
    }, [pollutantChoices])

    return <>
        <FlexContainer>
            <br/>
            <h1>Generación de reporte para la visualización de excesos en los contaminantes</h1><br/>

            <Spin spinning={loading}>
            <StyledForm
                initialValues={{
                    formPollutant: pollutantIndex, formStation: stationIndex
                }}
                onFinish={onFinish}
            >
                <FormItem
                    label={"Contaminante"}
                    name={"formPollutant"}
                    rules={[{
                        required: true, message: 'Debes ingresar un contaminante',
                    },
                    {validator: (info, values) => validateChoices(info, values, pollutantChoices)}
                    ]}
                >
                    <PollutantsChoices />
                </FormItem>

                <FormItem
                    label={"Estación"}
                    name={"formStation"}
                    rules={[{
                        required: true, message: 'Debes ingresar una estación',
                    },
                    {validator: (info, values) => validateChoices(info, values, stationsChoices)}
                    ]}
                >
                    <StationChoices />
                </FormItem>

                <FormItem
                    label={"Rango de fechas"}
                    name={"dateRange"}
                    rules={[{
                        required: true, message: 'Debes ingresar una fecha de inicio y una de término',
                    },
                        {validator: validateDatePicker}
                    ]}
                >
                    <RangePicker/>
                </FormItem>

                <FormItem>
                    <Button type="primary" htmlType="submit">
                        Generar reporte
                    </Button>
                </FormItem>
            </StyledForm>
        </Spin>
    </FlexContainer>
        </>
}

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  vertical-align: center;
  text-align: center;
  min-height: 100%;
`

const StyledForm = styled(Form)`
  min-width: 100%;
`

const FormItem = styled(Form.Item)`
  display: flex;
  align-items: flex-end;
`

