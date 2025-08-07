import getAccessToken from "../script/utils/getToken.js";

export let incomeData;

const token = getAccessToken();

async function getIncome() {
  const response = await fetch('http://localhost:3000/income', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  incomeData = data;
  return incomeData;
}


export async function loadIncomeData() {
  return await getIncome();

}



export async function monthlyIncomeSummary() {
  await loadIncomeData();
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

export async function updateDate() {
   await loadIncomeData();
    incomeData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
}
