export const getDateFormat = (date, format) => {
  const newDate = new Date(date);
  const map = {
    mm: newDate.getMonth() + 1,
    dd: newDate.getDate(),
    yy: newDate.getFullYear().toString().slice(-2),
    yyyy: newDate.getFullYear()
  }

  return format.replace(/mm|dd|yy|yyy/gi, matched => map[matched])
}

export const getLocaleDateFormat = (date, format) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString('en-US', format);
}

