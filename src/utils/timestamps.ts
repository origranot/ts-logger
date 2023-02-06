export const getTimeStamp = (date: Date) => {
    const splittedDate = date.toISOString().split('T')
    return splittedDate[0] + " " + splittedDate[1].slice(0, 8);
}