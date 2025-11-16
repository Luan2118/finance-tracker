import { expenseData, loadExpenseData } from "./expenseData.js";
import { incomeData, loadIncomeData } from "./incomeData.js";



export let sharedData;



export async function loadSharedData() {
  await loadExpenseData();
  await loadIncomeData();
  sharedData =  [
    ...expenseData.map(item => ({...item, type: 'expense'})),
    ...incomeData.map(item => ({...item, type: 'income'}))
  ]
  
  return sharedData; 
}


await updateSharedDate() 
export async function updateSharedDate() {
  await loadSharedData();
  sharedData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
}




