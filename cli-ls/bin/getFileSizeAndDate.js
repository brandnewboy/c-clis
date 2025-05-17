
const getFileSizeAndDate = stat => {

    const size = stat.size

    const d = new Date(stat.birthtimeMs)
    const month = d.getMonth() + 1 + '月'
    const date = d.getDate()
    const hour = d.getHours()
    const minute = d.getMinutes()

    let dateStr = month + ' ' + date + ' ' + hour + ':' + minute

    return size + '\t' + dateStr
}

module.exports = {
    getFileSizeAndDate
}