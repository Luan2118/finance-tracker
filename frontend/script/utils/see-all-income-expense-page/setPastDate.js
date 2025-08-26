
function setPastDate(number) {
  const today = new Date();
  return new Date(new Date().setDate(today.getDate() - number))
}

export default setPastDate;