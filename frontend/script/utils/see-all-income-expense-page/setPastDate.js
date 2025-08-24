
function setPastDate(number) {
  return new Date(new Date().setDate(today.getDate() - number))
}

export default setPastDate;