export const getDaysBetweenTwoDates = (startDate, endDate) => {
    const date = new Date(startDate);
    const targetDate = new Date(endDate)
    const dates = [];
    while (date <= targetDate) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return dates;
}
