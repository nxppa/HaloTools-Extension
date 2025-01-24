function convertEpochToDate(epochTime, isMonthFirst = true) {
    const date = new Date(epochTime);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const formattedDay = day.toString().padStart(2, '0');
    const formattedMonth = month.toString().padStart(2, '0');
    if (isMonthFirst) {
        return `${formattedMonth}/${formattedDay}`
    } else {
        return `${formattedDay}/${formattedMonth}`
    }
}
console.log(convertEpochToDate(1737714671200))