import {useEffect, useState} from "react";
import axios from "axios";

export const usePost = ({url, options, dataToQuery}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [errors, setErrors] = useState([])
    const [data, setData] = useState(null)

    const fetchData = () => {
        setIsLoading(true)
        setData(null)
        axios.post(url, dataToQuery, options)
            .catch(e => {
                setErrors(e)
                setIsLoading(false)
            })
            .then(({data}) => {
                setData(data)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        fetchData()
    }, [url, options, dataToQuery])

    console.log('data', data)

    return {data, isLoading, errors, fetchData}
}
