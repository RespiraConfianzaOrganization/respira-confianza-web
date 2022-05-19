import {useEffect, useState} from "react";
import {getStationsChoices} from "../Charts/queries/stations";
import {getPollutantsChoices} from "../Charts/queries/pollutants";
import {Button, DatePicker, Form, Select, Spin} from 'antd';
import {postRequest} from "../../utils/axios";
import {saveAs} from 'file-saver'
import moment from "moment";
import styled from "styled-components";

const {RangePicker} = DatePicker
const {Option} = Select;

const REPORT_URL = `${process.env.REACT_APP_API_URL}/api/reports/exceed-threshold`


const DEFAULT_STATION_INDEX = 0
const DEFAULT_POLLUTANT_INDEX = 0

export const ExceedAirQuality = () => {
    const [stationsChoices, setStationsChoices] = useState([])
    const [pollutantChoices, setPollutantChoices] = useState([])

    const [stationsReady, setStationsReady] = useState(false)
    const [pollutantsReady, setPollutantsReady] = useState(false)

    const [loading, setLoading] = useState(false)

    const loadStations = stations => {
        setStationsChoices(stations)
        setStationsReady(true)
    }

    const loadPollutants = pollutants => {
        setPollutantChoices(pollutants)
        setPollutantsReady(true)
    }

    useEffect(() => {
        // Stations
        getStationsChoices().then(loadStations)
        // Pollutants
        getPollutantsChoices().then(loadPollutants)
    }, [])

    const sendForm = inputData => {
        setLoading(true)
        postRequest(REPORT_URL, inputData, "arraybuffer")
            .then(r => {
                const {data} = r
                const blob = new Blob([data], {type: 'application/pdf'})
                setLoading(false)
                saveAs(blob, 'reporte.pdf')
            })
    }

    const validateData = data => {
        return true
    }

    const plotErrors = () => {
        return null
    }

    const onFinish = ({pollutantIndex, stationIndex, dateRange}) => {

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

        const isValidData = validateData(data)

        if (isValidData) {
            sendForm(data)
        } else {
            plotErrors()
        }
    }

    const StationChoices = () => {
        return !stationsReady ? null : <Select>
            {stationsChoices.map((p, idx) => {
                return <Option key={idx} value={idx}>
                    {p.label}
                </Option>
            })}
        </Select>
    }

    const PollutantsChoices = () => {
        return !pollutantsReady ? null : <Select>
            {pollutantChoices.map((p, idx) => {
                return <Option key={idx} value={idx}>
                    {p.label}
                </Option>
            })}
        </Select>
    }

    return <FlexContainer>
        <Spin spinning={loading}>
            <StyledForm
                // name="basic"
                initialValues={{
                    pollutantIndex: DEFAULT_POLLUTANT_INDEX, stationIndex: DEFAULT_STATION_INDEX
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    label={"Contaminante"}
                    name={"pollutantIndex"}
                    rules={[{
                        required: true, message: 'Debes ingresar un contaminante',
                    },]}
                >
                    <PollutantsChoices />
                </Form.Item>

                <Form.Item
                    label={"Estación"}
                    name={"stationIndex"}
                    rules={[{
                        required: true, message: 'Debes ingresar una estación',
                    },]}
                >
                    <StationChoices />
                </Form.Item>

                <Form.Item
                    label={"Rango de fechas"}
                    name={"dateRange"}
                    rules={[{
                        required: true, message: 'Debes ingresar un rango de fechas',
                    },]}
                >
                    <RangePicker/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Generar reporte
                    </Button>
                </Form.Item>
            </StyledForm>
        </Spin>
    </FlexContainer>
}

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  vertical-align: center;
  min-height: 100%;
`

const StyledForm = styled(Form)`
  min-width: 100%;
`
