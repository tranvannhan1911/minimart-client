export const formater = (date) => {
    return (new Date(Date.parse(date))).toLocaleString("vi-VI")
}