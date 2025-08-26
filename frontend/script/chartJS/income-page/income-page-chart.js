import { incomeData, loadIncomeData, monthlyIncomeSummary } from "../../../data/incomeData.js";
import { loadGetSymbol, formatCurrency } from "../../utils/currencySymbols.js";






renderIncomeChart();



export let myChart = null;
export async function renderIncomeChart() {
  await loadIncomeData();
  const ctx = document.getElementById('income-chart')

  const symbol = await loadGetSymbol(incomeData);

  const monthlySums = await monthlyIncomeSummary();

  const labels = Object.keys(monthlySums)
  const data = Object.values(monthlySums)


  myChart = new Chart(ctx, {
      type: 'bar', // or 'pie', 'line', etc.
      data: {
          labels,
          datasets: [{
              label: 'Income',
              data,
              backgroundColor: ['rgb(90, 207, 100)'],
              barPercentage: 0.7,
              borderRadius: 15,
              hoverBackgroundColor: 'rgba(96, 224, 107, 0.81)',
              hoverBorderWidth: '50px'
          }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
            },
            ticks: {
              font: {
                size: 13,
                family: 'Arial'
              }
            }
          },
          y: {
            ticks: {
              font: {
                size: 15,
                family: 'Arial'
              }
            }
          }
        },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 19,
                  family: 'Arial'
                }
              },
            },
            tooltip: {
              callbacks: {
                title: function() {
                  return 'Monthly Income Summary'
                },
                label: function (context) {
                  return `Amount: ${formatCurrency(context.formattedValue, symbol)}`
                }
              }
            },
            
          },
      }
  });




  const filter = document.getElementById('chart-filter')

  filter.addEventListener('change', (date) => {
    const year = date.target.value.substring(0, 4);
    const month = date.target.value.substring(5, 7);


    const lastDayOfMonth = (y , m) => {
      return new Date(y , m, 0).getDate();
    }

    const firstDay = `${date.target.value}-01`;

    const lastDay = `${date.target.value}-${lastDayOfMonth(year, month)}`;

    myChart.options.scales.x.min = firstDay;
    myChart.options.scales.x.max = lastDay;
    myChart.options.scales.x.time.unit = 'day';


    myChart.data.labels  = incomeData.map(item => item.dateValue);
    myChart.data.datasets[0].data =  incomeData.map(item => item.amountValue);
    
    myChart.options.plugins.tooltip.callbacks.title = function(context) {
      const dataIndex = context[0].dataIndex;
      const item = incomeData[dataIndex];

      return item.incomeSourceValue
    }

    myChart.update();
    
  })



  const chartResetButton = document.getElementById('chart-reset-button')

  chartResetButton.addEventListener('click', () => {
    filter.value = ''

    myChart.options.scales.x.min = undefined;
    myChart.options.scales.x.max = undefined;
    myChart.options.scales.x.time.unit = 'month';

    myChart.data.labels  = Object.keys(monthlySums);
    myChart.data.datasets[0].data =  Object.values(monthlySums);

    myChart.options.plugins.tooltip.callbacks.title = () => {
      return ['Monthly Income Summary'];}

    myChart.update();
  })

}