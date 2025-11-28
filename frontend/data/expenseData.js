import getAccessToken from "../script/utils/getAccessToken.js";
import refreshToken from "../script/utils/refreshToken.js";
import { API_BASE_URL } from "../script/utils/apiConfig.js";

export let expenseData;


async function getExpenseData() {
  try {
    let token = getAccessToken();

    let response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if(response.status === 401) {
      token = await refreshToken();
      sessionStorage.setItem('accessToken', token)
      response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    }

   
    

    if(!response.ok)  throw new Error(`Failed to fetch: ${response.status}`);

    const data = await response.json();
    expenseData = data;
    return expenseData
    
  } catch (error) {
    console.error(error)
  }
}

export async function loadExpenseData() {
  return await getExpenseData();
}

export  function setExpenseData(data) {
  expenseData = data;
  expenseData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
  return  expenseData;
}


export async function monthlyExpenseSummary() {
  await loadExpenseData();
  const monthlySum = {};
  expenseData.forEach((data) => {
  const date = new Date(data.dateValue)
  const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` 

  if(!monthlySum[monthKey]) {
    monthlySum[monthKey] = 0
  }

  monthlySum[monthKey] += Number(data.amountValue);

  })

  return monthlySum;
}


await updateExpenseDate();
export async function updateExpenseDate() {
  await loadExpenseData();
  expenseData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
}


