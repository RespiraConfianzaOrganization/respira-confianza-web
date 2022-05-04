import moment from "moment";
import {range} from "./math";

export const getNDays = ({n}) => {
    const currentDatetime = moment().toISOString()
    const inmutableDate = new Date(currentDatetime)
    return range(n).map(offset => {
        const newDate = inmutableDate.getDate() + offset;
        const mutableDate = new Date()
        mutableDate.setDate(newDate)
        return mutableDate
    });
};
