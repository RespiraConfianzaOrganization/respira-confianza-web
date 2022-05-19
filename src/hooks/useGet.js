import {useState} from "react";
import axios from "axios";

export const useGet = ({url, options, dataToQuery}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [errors, setErrors] = useState([])
    const [data, setData] = useState(null)

    const fetchData = () => {
        setIsLoading(true)
        setData(null)
        axios.get(url, dataToQuery, options)
            .catch(e => {
                setIsLoading(false)
                setErrors(e)
            })
            .then(({data}) => setData(data))
    }

    return [data, isLoading, errors, fetchData]
}
