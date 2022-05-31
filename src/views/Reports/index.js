import {useEffect, useState} from "react";
import {getStationsChoices} from "../Charts/queries/stations";
import {getPollutantChoicesFromThresholds} from "../Charts/queries/pollutants";
import {Button, DatePicker, Form, message, Select, Spin} from 'antd';
import {postRequest} from "../../utils/axios";
import {saveAs} from 'file-saver'
import moment from "moment";
import styled from "styled-components";
import {validateChoices, validateDatePicker} from "./validators";
import {pollutantsReportImg} from "../../assets";

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

    const loadStations = stations => setStationsChoices(stations)

    const loadPollutants = pollutants => setPollutantChoices(pollutants)

    useEffect(() => {
        // Stations
        getStationsChoices().then(loadStations)
        // Pollutants
        getPollutantChoicesFromThresholds().then(loadPollutants)
    }, [])

    const handlePollutantOnChange = i => setPollutantIndex(i)

    const handleStationOnChange = i => setStationIndex(i)

    const handleFormErrors = async (error) => {
        const data = error.response.data
        const decodedData = new TextDecoder().decode(data)
        const jsonErrors = JSON.parse(decodedData)
        const errors = jsonErrors.errors || {}

        for (const field of Object.keys(errors)) {
            const fieldErrors = errors[field]
            for (const fieldError of fieldErrors) {
                const content = `${field}: ${fieldError}`
                await message.error(content)
            }
        }

        setLoading(false)

    }

    const downloadPDF = response => {
        const { data } = response
        const blob = new Blob([data], {type: 'application/pdf'})
        setLoading(false)
        saveAs(blob, 'reporte.pdf')
    }

    const sendForm = inputData => {
        try {
            setLoading(true)
            postRequest(REPORT_URL, inputData, "arraybuffer")
                .then(downloadPDF)
                .catch(handleFormErrors)
            return true
        } catch (e) {
            return false
        }
    }

    const onSubmit = ({dateRange}) => {

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

        return sendForm(data)
    }

    return <>
        <ViewContainer>
            <ColumnsContainer>
                <SideImage alt={"xd"}
                     src={pollutantsReportImg}/>
                <FormContainer>
                    <br/>
                    <h1>Reporte de excesos en la emisión de contaminantes</h1><br/>

                    <Spin spinning={loading}>
                        <StyledForm
                            onFinish={onSubmit}
                        >
                            <FormItem
                                label={"Estación"}
                                name={"formStation"}
                                rules={[
                                    {
                                        required: true, message: 'Debes ingresar una estación',
                                    },
                                    {
                                        validator: async (info, values) => await validateChoices(info, values, stationsChoices)
                                    }
                                ]}
                            >
                                <Select
                                    onChange={handleStationOnChange}
                                    placeholder={"Escoge una estación"}
                                >
                                    {stationsChoices.map(({label}, idx) => {
                                        return <Option key={idx} value={idx}>
                                            {label}
                                        </Option>
                                    })}
                                </Select>
                            </FormItem>

                            <FormItem
                                label={"Contaminante"}
                                name={"formPollutant"}
                                rules={[
                                    {
                                        required: true, message: 'Debes ingresar un contaminante',
                                    },
                                    {
                                        validator: async (info, values) => await validateChoices(info, values, pollutantChoices)
                                    }
                                ]}
                            >
                                <Select
                                    onChange={handlePollutantOnChange}
                                    placeholder={"Escoge un contaminante"}
                                >
                                    {pollutantChoices.map(({label}, idx) => {
                                        return <Option key={idx} value={idx}>
                                            {label}
                                        </Option>
                                    })}
                                </Select>
                            </FormItem>

                            <FormItem
                                label={"Rango de fechas"}
                                name={"dateRange"}
                                rules={[
                                    {
                                        required: true, message: 'Debes ingresar una fecha de inicio y una de término',
                                    },
                                    {
                                        validator: validateDatePicker
                                    }
                                ]}
                            >
                                <RangePicker/>
                            </FormItem>

                            <FormItem>
                                <></>
                                <Button type="primary" htmlType="submit">
                                    Generar reporte
                                </Button>
                            </FormItem>
                        </StyledForm>
                    </Spin>
                </FormContainer>
            </ColumnsContainer>
        </ViewContainer>
    </>
}

const SideImage = styled.img`
  height: 50vh;
  border-radius: 10px 0 0 10px;
`

const ViewContainer = styled.div`
  margin-top: 12vmin;
  width: 85%;
  background: white;
  border-radius: 10px;
`

const ColumnsContainer = styled.div`
  display: grid;
  grid-template-columns: min-content auto;
`

const FormContainer = styled.div`
  vertical-align: center;
  text-align: center;
  min-width: 30%;
`

const StyledForm = styled(Form)`
  min-width: 100%;
`

const FormItem = styled(Form.Item)`
  display: grid;
  grid-template-columns: 30% 1fr;
  padding-right: 5%;

  .ant-picker {
    min-width: 100%;
  }
  
  &:last-child {
    margin-left: 27%;
    display: flex;
    align-content: center;
    justify-content: center;
  }
`

