function getFormattedDate(dateValue) {
  return dateValue.substring(8,10) + '-' + dateValue.substring(5,7) + '-' +  dateValue.substring(0, 4)
}

export default getFormattedDate;