import { expenseData } from "./expenseData.js";
import { incomeData } from "./incomeData.js";




export const sharedData =   [
  ...expenseData.map(item => ({...item, type: 'expense'})),
  ...incomeData.map(item => ({...item, type: 'income'}))
] 


sharedData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))




