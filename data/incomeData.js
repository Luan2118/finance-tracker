

export let incomeData =  JSON.parse(localStorage.getItem('incomeData')) || [
  {
    incomeSourceValue: 'Example',
    amountValue: 10000,
    dateValue: '2025-05-17',
    id: crypto.randomUUID()
  }
]


export function monthlyIncomeSummary() {
  const monthlySums = {};
  incomeData.forEach(item => {
    const date = new Date(item.dateValue)

    const monthKey =  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!monthlySums[monthKey]) {
      monthlySums[monthKey] = 0;
    } 

    monthlySums[monthKey] += Number(item.amountValue)
  })

  return monthlySums;
}

updateDate();

export function updateDate() {
  incomeData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
}


export function saveToStorageIncome() {
  localStorage.setItem('incomeData', JSON.stringify(incomeData));
}



export function deleteIncome (deleteButtonId) {
  const newData = [];

  incomeData.forEach((dataObject) => {
    if (dataObject.id !== deleteButtonId) {
      newData.push(dataObject)
    } 

  })

  incomeData = newData;
  
  saveToStorageIncome();
}
