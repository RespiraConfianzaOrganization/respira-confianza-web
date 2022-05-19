import {useEffect, useState} from "react";
import {getStationsChoices} from "../Charts/queries/stations";
import {getPollutantsChoices} from "../Charts/queries/pollutants";
import {Button, DatePicker, Form, Select} from 'antd';
import {postRequest} from "../../utils/axios";
import {saveAs} from 'file-saver'

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

    const onFinish = ({pollutantIndex, stationIndex, dateRange}) => {
        const [startDate, endDate] = dateRange
        const {name} = pollutantChoices[pollutantIndex]['value']
        const {id} = stationsChoices[stationIndex]['value']
        postRequest(REPORT_URL, {
            startDate: startDate.format('YYYY-MM-DD').toString(),
            endDate: endDate.format('YYYY-MM-DD').toString(),
            pollutant: name,
            station: id
        }, "arraybuffer")
            .then(r => {
                const {data} = r
                const blob = new Blob([data], {type: 'application/pdf'})
                saveAs(blob, 'reporte.pdf')
            })

    }

    const onFinishFailed = () => {
    }

    return <>
        <Form
            name="basic"
            initialValues={{
                pollutantIndex: DEFAULT_POLLUTANT_INDEX, stationIndex: DEFAULT_STATION_INDEX
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label={"Contaminante"}
                name={"pollutantIndex"}
                rules={[{
                    required: true, message: 'Debes ingresar un contaminante',
                },]}
            >
                {pollutantsReady && <Select>
                    {pollutantChoices.map((p, idx) => {
                        return <Option key={idx} value={idx}>
                            {p.label}
                        </Option>
                    })}
                </Select>}
            </Form.Item>

            <Form.Item
                label={"Estación"}
                name={"stationIndex"}
                rules={[{
                    required: true, message: 'Debes ingresar una estación',
                },]}
            >
                {stationsReady && <Select>
                    {stationsChoices.map((p, idx) => {
                        return <Option key={idx} value={idx}>
                            {p.label}
                        </Option>
                    })}
                </Select>}
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
        </Form>
    </>
}

export default ExceedAirQuality;
