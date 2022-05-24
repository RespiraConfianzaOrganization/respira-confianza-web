import moment from "moment";

const isValidDate = value => {
    try {
        return moment(value, 'YYYY-MM-DD').isValid()
    } catch (e) {
        return false
    }
}

const datesAreValid = (startDate, endDate) => {
    try {
        const parsedStartDate = moment(startDate, 'YYYY-MM-DD')
        const parsedEndDate = moment(endDate, 'YYYY-MM-DD')
        return parsedEndDate.diff(parsedStartDate, 'days') >= 0
    } catch (e) {
        return false
    }
}

export const validateDatePicker = async (info, value) => {
    try {
        const [startDate, endDate] = value
        if (!isValidDate(startDate)) {
            const error = new Error('Fecha inicial invalida')
            return Promise.reject(error)
        }
        if (!isValidDate(endDate)) {
            const error = new Error('Fecha final invalida')
            return Promise.reject(error)
        }
        if (!datesAreValid(startDate, endDate)) {
            const error = new Error('Fecha inicial no puede ser menor que la fecha final')
            return Promise.reject(error)
        }
    } catch (e) {
        const error = new Error('Debes seleccionar una fecha de inicio y una de término')
        return Promise.reject(error)
    }
}

export const validateChoices = async (info, value, choices) => {
    try {
        if (!(value < choices.length && value >= 0)) {
            const error = new Error('Debes seleccionar una opción válida')
            return Promise.reject(error)
        }
    } catch (e) {
        const error = new Error('Debes seleccionar una opción válida')
        return Promise.reject(error)
    }
}
