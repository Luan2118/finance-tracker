import getAccessToken from "../script/utils/getToken.js";
import refreshToken from "../script/utils/refreshToken.js";
export let incomeData;


async function getIncome() {
  try {
    let token = getAccessToken();


    let response = await fetch('http://localhost:3000/income', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if(response.status === 401) {
      token = await refreshToken();
      sessionStorage.setItem('accessToken', token)
      response = await fetch('http://localhost:3000/income', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    };

    if(!response.ok)  throw new Error(`Failed to fetch: ${response.status}`);

    const data = await response.json();
    incomeData = data;
    return incomeData;


  } catch (error) {
    console.error(error.message)
  }
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
