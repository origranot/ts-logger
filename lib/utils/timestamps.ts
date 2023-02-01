export const getTimeStamp = () => {
    const splittedDate = new Date().toISOString().split('T')
    return splittedDate[0] + " " + splittedDate[1].slice(0, 8);
}