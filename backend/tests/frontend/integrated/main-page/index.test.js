import {describe, it, beforeEach, expect, vi} from 'vitest';
import {screen, within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';


let fakeIncomeData = vi.hoisted(() => {
  return [
    {amountValue: 10000, category: "Part-Time", currency: "CZK", dateValue: "2025-09-09", emoji: "", incomeSourceValue: "Part-Time", user: "6893682cc44043ab368bd87f",__v: 0, _id: "68c9c6dffcac0f995236cdb9"},
    {amountValue: 15000, category: "Salary", currency: "CZK", dateValue: "2025-11-11", emoji: "", incomeSourceValue: "Salary", user: "6893682cc44043ab368bd87f",__v: 0, _id: "68c9c6dffcac0f995236cdb10"}
  ]
})

let fakeExpenseData = vi.hoisted(() => {
  return [
  {amountValue: 5000, category: "Dining out/ Takeout", currency: "CZK", dateValue: "2025-12-12", emoji: "", expenseSourceValue: "Steak house", user: "6893682cc44043ab368bd87f", __v: 0, _id: "691234678944c535c901e582"},
  {amountValue: 10000, category: "Shopping", currency: "CZK",dateValue: "2025-10-10", emoji: "",expenseSourceValue: "Clothes", user: "6893682cc44043ab368bd87f", __v: 0, _id: "691234678944c535c901e682"},
]
});

let fakeSharedData = vi.hoisted(() => {
  return [
    {amountValue: 10000, category: "Part-Time", currency: "CZK", dateValue: "2025-09-09", emoji: "", incomeSourceValue: "Part-Time", type: "income",user: "6893682cc44043ab368bd87f", __v: 0,_id: "68c9c6dffcac0f995236cdb9"},
     {amountValue: 15000, category: "Salary", currency: "CZK", dateValue: "2025-11-11", emoji: "", incomeSourceValue: "Salary", type: "income",user: "6893682cc44043ab368bd87f", __v: 0,_id: "68c9c6dffcac0f995236cdb10"},
    {amountValue: 5000, category: "Dining out/ Takeout", currency: "CZK", dateValue: "2025-12-12", emoji: "", expenseSourceValue: "Steak house", type: "expense",user: "6893682cc44043ab368bd87f", __v: 0,_id: "691234678944c535c901e582"},
     {amountValue: 10000, category: "Shopping", currency: "CZK", dateValue: "2025-10-10", emoji: "", expenseSourceValue: "Clothes", type: "expense",user: "6893682cc44043ab368bd87f", __v: 0,_id: "691234678944c535c901e682"}

  ]
})

// Income data mock
vi.mock('../../../../../frontend/data/incomeData.js', () => {

  const fakeIncomeMonthlySum = {'2025-09': 10000, '2025-10': 15000}
  const loadIncomeData = vi.fn().mockResolvedValue(fakeIncomeData);
  return {
    incomeData: fakeIncomeData,
    loadIncomeData,
    monthlyIncomeSummary: vi.fn().mockResolvedValue(fakeIncomeMonthlySum),
    updateIncomeDate: vi.fn().mockImplementation(async () => {
      await loadIncomeData();
      fakeIncomeData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
    })
  }
  
})


// Income Chart mock - income-page-chart
vi.mock('../../../../../frontend/script/chartJS/income-page/income-page-chart.js', () => {
  return {
    myChart: null
  }
});

// Expense data mock
vi.mock('../../../../../frontend/data/expenseData.js', () => {

  const fakeExpenseMonthlySum = {'2025-09': 5000, '2025-10': 10000};

  const loadExpenseData =  vi.fn().mockResolvedValue(fakeExpenseData);

  return {
    expenseData: fakeExpenseData,
    loadExpenseData,
    monthlyExpenseSummary: vi.fn().mockResolvedValue(fakeExpenseMonthlySum),
    updateExpenseDate: vi.fn().mockImplementation(async () => {
      await loadExpenseData();
      fakeExpenseData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
    })
  }
})


// Expense chart variable mock
vi.mock('../../../../../frontend/script/chartJS/expense-page/expense-page-chart.js', () => {
  return {
    renderExpenseChart: vi.fn()
  }
})

// Shared data mock
vi.mock('../../../../../frontend/data/sharedData.js', () => {

  const loadSharedData = vi.fn().mockResolvedValue(fakeSharedData)
  return {
    sharedData: fakeSharedData,
    loadSharedData,
    updateSharedDate: vi.fn().mockImplementation(async() => {
      await loadSharedData();
      fakeSharedData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
    })
  }
})

vi.mock('../../../../../frontend/script/utils/see-all-income-expense-page/setPastDate.js', () => {
  return {
    default: vi.fn().mockImplementation((number) => {
      const today = new Date();
      return new Date(new Date().setDate(today.getDate() - number))
    })
  }
})

import setPastDate from '../../../../../frontend/script/utils/see-all-income-expense-page/setPastDate.js';
import { monthlyIncomeSummary } from '../../../../../frontend/data/incomeData';


// Income Chart mock - main-page-chart
vi.mock('../../../../../frontend/script/chartJS/main-page/income-chart.js', async () => {

  
  const { loadIncomeData } = await import('../../../../../frontend/data/incomeData.js');

  const today1 = new Date()
  const yearMonthToday = `${today1.getFullYear()}-${String(today1.getMonth() + 1).padStart(2, '0')}`

  const last60 = setPastDate(60)
  const yearMonthLast60 = `${last60.getFullYear()}-${String(last60.getMonth() + 1).padStart(2, '0')}`

  let filteredIncome = vi.fn().mockImplementation(async () => {
      await loadIncomeData();
      const filteredIncomeData = fakeIncomeData.filter(item => {
        const yearMonth = item.dateValue.substring(0, 7)
        return yearMonth <= yearMonthToday && yearMonth >= yearMonthLast60
      })
      .map(item => ({
        incomeSourceValue: item.incomeSourceValue,
        dateValue: item.dateValue,
        amountValue: item.amountValue
      }))
      
      return filteredIncomeData;
    })

  return {
    incomeChart: null,
    renderIncomeChart: vi.fn(),
    filteredIncome,
    incomeLast60DaysSum: vi.fn().mockImplementation(async () => {
      const filteredIncomeData = await filteredIncome();
      const last60DaysIncomeSum = filteredIncomeData.reduce((sum, item) => {
        const result = sum + Number(item.amountValue);
        return result;
      }, 0)
      
      return last60DaysIncomeSum.toFixed(2);
    })
  }
});

// Expense chart mock - main-page
vi.mock('../../../../../frontend/script/chartJS/main-page/expense-chart.js', () => {
  return {
    default: vi.fn()
  }
})

// Financial overview chart mock - main-page
vi.mock('../../../../../frontend/script/chartJS/main-page/financial-overview-chart.js', () => {
  return {
    financialOverviewChart: null,
    renderFinancialOverviewChart: vi.fn()
  }
})

// iconPicker mock
vi.mock('../../../../../frontend/script/utils/icon-picker.js', () => {
  return {
    iconPicker: vi.fn()
  }
});

// menuIcon mock
vi.mock('../../../../../frontend/script/utils/menuIcon.js', () => {
  return {
    menuIcon: vi.fn()
  }
});

// currencySymbols mocks
vi.mock('../../../../../frontend/script/utils/currencySymbols.js', () => {
  return {
    loadGetSymbol: vi.fn().mockResolvedValue('Kč'),
    formatCurrency: vi.fn().mockImplementation((amountValue, symbol) => {
      if (symbol === 'Kč') {
        return `${amountValue} Kč`;
      } else {
        return `${symbol}${amountValue}`
      }
    })
  }
});

// getAccessToken mock
vi.mock('../../../../../frontend/script/utils/getAccessToken.js', () => {
  return {
    default: vi.fn().mockReturnValue('FAKE_ACCESS_TOKEN')
  }
});

// logOut mock
vi.mock('../../../../../frontend/script/logout.js', () => {
  return {
    default: vi.fn()
  }
})

// refreshToken mock
vi.mock('../../../../../frontend/script/utils/refreshToken.js', () => {
  return {
    default: vi.fn().mockResolvedValue('NEW_FAKE_ACCESS_TOKEN')
  }
});

// getUsername mock
vi.mock('../../../../../frontend/script/utils/getUsername.js', () => {
  return {
    default: vi.fn().mockResolvedValue('TestUser')
  }
});

// getFormattedDate mock
vi.mock('../../../../../frontend/script/utils/getFormattedDate.js', () => {
  return {
    default: vi.fn().mockImplementation((dateValue) => {
      return dateValue.substring(8,10) + '-' + dateValue.substring(5,7) + '-' +  dateValue.substring(0, 4)
    })
  }
})

// updateChart mock
vi.mock('../../../../../frontend/script/utils/updateChart.js', () => {
  return {
    updateChart: vi.fn()
  }
});


beforeEach(() => {
  vi.resetModules();
})


async function setUpMainPage() {

  document.body.innerHTML = 
  `
    <!--Profile name -->
    <div class="profile-name profile-name-js"></div>

    <!--Currency -->
    <section class="dropdown" aria-label="Currency menu">
      <div class="currency-box">
        <div class="js-currency"></div>
        <button id="drop-down-box" class="dropdown-btn" aria-controls="drop-down-menu" aria-expanded="false"><img class="dropdown-arrow-icon" src="icons/dropdown-arrow-icon.png" alt=""></button>
      </div>

      <fieldset id="drop-down-menu">
        <legend class="sr-only">Currency options</legend>

        <div id="options" class="options">
          <div>
            <input id="USD" type="radio" name="currency-check">
            <label for="USD" class="currency">USD</label>
          </div>

          <div>
            <input id="EUR" type="radio" name="currency-check">
            <label for="EUR" class="currency">EUR</label>
          </div>

          <div>
            <input id="JPY" type="radio" name="currency-check">
            <label for="JPY" class="currency">JPY</label>
          </div>

          <div>
            <input id="GBP" type="radio" name="currency-check">
            <label for="GBP" class="currency">GBP</label>
          </div>

          <div>
            <input id="CZK" type="radio" name="currency-check">
            <label for="CZK" class="currency">CZK</label>
          </div>
        </div>
      </fieldset>
    </section>

    <!--Total Balance -->
    <div data-testid="total-balance" class="summary-amount js-total-balance-header-summary"></div>

    <!--Total Income -->
    <div data-testid="total-income" class="summary-amount js-income-header-summary"></div>
    
    <!--Total Expenses -->
    <div data-testid="total-expense" class="summary-amount js-expense-header-summary"></div>

    <!--Recent transactions list -->
    <section class="transactions-grid">
      <div class="recent-transactions-grid" >
        <h2 class="transactions-title">Recent Transactions</h2>
      </div>
      <ol class="transactions-info-grid js-transactions-info-grid"></ol>
    </section>

    <!--Expense list -->
    <section class="transactions-grid">
      <div class="recent-transactions-grid">
        <h2  class="transactions-title">Expenses</h2>
        <a class="see-all-button" href="expense-page.html">See All<span class="see-all-arrow">&#8594;</span></a>
      </div>
      <ol class="transactions-info-grid js-expense-transactions-info-grid"></ol>
    </section>

    <!--Income list -->
    <section class="transactions-grid" >
      <div class="recent-transactions-grid">
        <h2  class="transactions-title">Income</h2>
        <a class="see-all-button" href="expense-page.html">See All <span class="see-all-arrow">&#8594;</span></a>
      </div>
      <ol class="transactions-info-grid js-income-transactions-info-grid"></ol>
    </section>
  `
  
  await import('../../../../../frontend/script/main.js')
}

import { loadIncomeData, monthlyIncomeSummary } from '../../../../../frontend/data/incomeData.js';

import { loadExpenseData, monthlyExpenseSummary, updateExpenseDate } from '../../../../../frontend/data/expenseData.js';
import { formatCurrency, loadGetSymbol } from '../../../../../frontend/script/utils/currencySymbols.js';
import { loadSharedData, updateSharedDate } from '../../../../../frontend/data/sharedData.js';


describe('Main page integration test', () => {
  it('should display balance overview after loading data', async () => {
    
    await setUpMainPage();

    // Verrify calls
    expect(loadIncomeData).toHaveBeenCalled();
    expect(monthlyIncomeSummary).toHaveBeenCalled();

    expect(loadExpenseData).toHaveBeenCalled();
    expect(monthlyExpenseSummary).toHaveBeenCalled();
    expect(loadGetSymbol).toHaveBeenCalled();

    // Verify total balance
    const totalBalanceDisplay = screen.getByTestId('total-balance');
    expect(formatCurrency).toHaveBeenCalled();
    expect(totalBalanceDisplay).toHaveTextContent('10000.00 Kč');

    // Verify total income
    const totalIncomeDisplay = screen.getByTestId('total-income');
    expect(totalIncomeDisplay).toHaveTextContent('+25000.00 Kč')

    // Verify total expense
    const totalExpenseDisplay = screen.getByTestId('total-expense');
    expect(totalExpenseDisplay).toHaveTextContent('-15000.00 Kč')

  });

  it('should display recent transactions list after loading data', async () => {

    await setUpMainPage();

    // Verify calls
    expect(loadSharedData).toHaveBeenCalled();
    expect(updateSharedDate).toHaveBeenCalled();
    expect(loadGetSymbol).toHaveBeenCalled();

    // Get the list, listitems and verify
    const recentTranHeading = screen.getByRole('heading', {name: /recent transactions/i});

    const section = recentTranHeading.closest('section');

    const list = within(section).getByRole('list');

    const listItems = within(list).getAllByRole('listitem');

    expect(listItems).toHaveLength(4);

    // Verify first data
    expect(listItems[0]).toHaveTextContent('Steak house');
    expect(listItems[0]).toHaveTextContent('12-12-2025');
    expect(listItems[0]).toHaveTextContent('-5000 Kč');
    expect(listItems[0]).toHaveTextContent('Category: Dining out/ Takeout');

    // Verify second data
    expect(listItems[1]).toHaveTextContent('Salary');
    expect(listItems[1]).toHaveTextContent('11-11-2025');
    expect(listItems[1]).toHaveTextContent('+15000 Kč');
    expect(listItems[1]).toHaveTextContent('Category: Salary');

    // Verify third data
    expect(listItems[2]).toHaveTextContent('Clothes');
    expect(listItems[2]).toHaveTextContent('10-10-2025');
    expect(listItems[2]).toHaveTextContent('-10000 Kč');
    expect(listItems[2]).toHaveTextContent('Category: Shopping');

    // Verify fourth data
    expect(listItems[3]).toHaveTextContent('Part-Time');
    expect(listItems[3]).toHaveTextContent('09-09-2025');
    expect(listItems[3]).toHaveTextContent('+10000 Kč');
    expect(listItems[3]).toHaveTextContent('Category: Part-Time');
  });

  it('should display expenses after loading data', async () => {

    await setUpMainPage();

    expect(loadExpenseData).toHaveBeenCalled();
    expect(updateExpenseDate).toHaveBeenCalled();
    expect(loadGetSymbol).toHaveBeenCalled();

    const expensesHeading = screen.getByRole('heading', {name: /expenses/i});

    const section = expensesHeading.closest('section');

    const list = within(section).getByRole('list');

    const listItems = within(list).getAllByRole('listitem')

     // Verify first expense
    expect(listItems[0]).toHaveTextContent('Steak house');
    expect(listItems[0]).toHaveTextContent('12-12-2025');
    expect(listItems[0]).toHaveTextContent('-5000 Kč');
    expect(listItems[0]).toHaveTextContent('Category: Dining out/ Takeout');

    // Verify second expense
     expect(listItems[1]).toHaveTextContent('Clothes');
    expect(listItems[1]).toHaveTextContent('10-10-2025');
    expect(listItems[1]).toHaveTextContent('-10000 Kč');
    expect(listItems[1]).toHaveTextContent('Category: Shopping');
  });

  it('should display income after loading data', async () => {

    await setUpMainPage();

    expect(loadExpenseData).toHaveBeenCalled();
    expect(updateExpenseDate).toHaveBeenCalled();
    expect(loadGetSymbol).toHaveBeenCalled();

    const expensesHeading = screen.getByRole('heading', {name: /income/i});

    const section = expensesHeading.closest('section');

    const list = within(section).getByRole('list');

    const listItems = within(list).getAllByRole('listitem')

     // Verify first income
    expect(listItems[0]).toHaveTextContent('Salary');
    expect(listItems[0]).toHaveTextContent('11-11-2025');
    expect(listItems[0]).toHaveTextContent('+15000 Kč');
    expect(listItems[0]).toHaveTextContent('Category: Salary');

    // Verify second expense
    expect(listItems[1]).toHaveTextContent('Part-Time');
    expect(listItems[1]).toHaveTextContent('09-09-2025');
    expect(listItems[1]).toHaveTextContent('+10000 Kč');
    expect(listItems[1]).toHaveTextContent('Category: Part-Time');
  });
})


// let fakeIncomeData = vi.hoisted(() => {
//   return [
//     {amountValue: 10000, category: "Part-Time", currency: "CZK", dateValue: "2025-09-09", emoji: "", incomeSourceValue: "Part-Time", user: "6893682cc44043ab368bd87f",__v: 0, _id: "68c9c6dffcac0f995236cdb9"},
//     {amountValue: 15000, category: "Salary", currency: "CZK", dateValue: "2025-11-11", emoji: "", incomeSourceValue: "Salary", user: "6893682cc44043ab368bd87f",__v: 0, _id: "68c9c6dffcac0f995236cdb10"}
//   ]
// })

// let fakeExpenseData = vi.hoisted(() => {
//   return [
//   {amountValue: 5000, category: "Dining out/ Takeout", currency: "CZK", dateValue: "2025-12-12", emoji: "", expenseSourceValue: "Steak house", user: "6893682cc44043ab368bd87f", __v: 0, _id: "691234678944c535c901e582"},
//   {amountValue: 10000, category: "Shopping", currency: "CZK",dateValue: "2025-10-10", emoji: "",expenseSourceValue: "Clothes", user: "6893682cc44043ab368bd87f", __v: 0, _id: "691234678944c535c901e682"},
// ]
// });