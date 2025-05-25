import { incomeData } from "../data/incomeData.js";

const ctx = document.getElementById('income-chart')

let labels = incomeData.map(item => item.dateValue);

const label = incomeData.map(item => item.incomeSourceValue);

const data = incomeData.map(item => item.amountValue);
console.log(label)

const myChart = new Chart(ctx, {
    type: 'bar', // or 'pie', 'line', etc.
    data: {
        labels,
        datasets: [{
            label: 'Income',
            data,
            backgroundColor: ['red', 'blue', 'green', 'orange']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
              callbacks: {
                beforeBody: function (context) {
                  const dataIndex = context[0].dataIndex;
                  const item = incomeData[dataIndex];

                  return item.incomeSourceValue
                },
                label: function (context) {
                  return `Amount: ${context.formattedValue}Kč`
                }
              }
            }
        },
    }
});


console.log(labels)


/*
let labels = incomeData.map(item => item.dateValue);
const ctx = document.getElementById('income-chart')

for (let i = 0; i < incomeData.length ; i++) {

}
const myChart = new Chart(ctx, {
    type: 'bar', // or 'pie', 'line', etc.
    data: {
        labels,
        datasets: [{
            label: 'Over-time',
            data: ['1000'],
            backgroundColor: ['red', 'blue', 'green', 'orange']
        },
      {
            label: 'Salary',
            data: ['30000'],
            backgroundColor: ['red', 'blue', 'green', 'orange']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        interaction: {
            mode: 'index'
        }
    }

    
});
*/