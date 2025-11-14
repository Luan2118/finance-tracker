import {describe, it, expect, beforeAll, beforeEach, vi, test} from 'vitest';
import userEvent from '@testing-library/user-event';
import {screen, within} from '@testing-library/dom';


let fakeData = vi.hoisted(() => {
  return [
  {amountValue: 5000, category: "Food & Groceries", currency: "CZK", dateValue: "2025-09-09", emoji: "", expenseSourceValue: "Steak house", user: "6893682cc44043ab368bd87f", __v: 0, _id: "691234678944c535c901e582"},
  {amountValue: 10000, category: "Shopping", currency: "CZK",dateValue: "2025-10-10", emoji: "",expenseSourceValue: "Clothes", user: "6893682cc44043ab368bd87f", __v: 0, _id: "691234678944c535c901e682"},
]
});


const baseFakeData =  [
  {amountValue: 5000, category: "Food & Groceries", currency: "CZK", dateValue: "2025-09-09", emoji: "", expenseSourceValue: "Steak house", user: "6893682cc44043ab368bd87f", __v: 0, _id: "691234678944c535c901e582"},
  {amountValue: 10000, category: "Shopping", currency: "CZK",dateValue: "2025-10-10", emoji: "",expenseSourceValue: "Clothes", user: "6893682cc44043ab368bd87f", __v: 0, _id: "691234678944c535c901e682"},
]


// Expense data mock
vi.mock('../../../../../frontend/data/expenseData.js', () => {

  const fakeMonthlySum = {'2025-09': 5000, '2025-10': 10000};

  const loadExpenseData =  vi.fn().mockResolvedValue(fakeData);

  return {
    expenseData: fakeData,
    loadExpenseData,
    monthlyExpenseSummary: vi.fn().mockResolvedValue(fakeMonthlySum),
    updateExpenseDate: vi.fn().mockImplementation(async () => {
      await loadExpenseData();
      expenseData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
    })
  }
})


// Expense chart variable mock
vi.mock('../../../../../frontend/script/chartJS/expense-page/expense-page-chart.js', () => {
  return {
    myExpenseChart: null
  }
})

// iconPicker mock
vi.mock('../../../../../frontend/script/utils/icon-picker.js', () => {
  return {
    iconPicker: vi.fn()
  }
})

// menuIcon mock
vi.mock('../../../../../frontend/script/utils/menuIcon.js', () => {
  return {
    menuIcon: vi.fn()
  }
})

// currencySymbols mock
vi.mock('../../../../../frontend/script/utils/currencySymbols.js', () => {
  return {
    loadGetSymbol: vi.fn().mockResolvedValue('Kč'),
    formatCurrency: vi.fn().mockImplementation((amount, currencySymbol) => {
      if (currencySymbol === 'Kč') {
        return `${amount} Kč`;
      } else {
        return `${currencySymbol}${amount}`
      }
    })
  }
})

// getAccessToken mock
vi.mock('../../../../../frontend/script/utils/getAccessToken.js', () => {
  return {
    default: vi.fn().mockReturnValue('FAKE_ACCESS_TOKEN')
  }
})

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
})

// getUsername mock
vi.mock('../../../../../frontend/script/utils/getUsername.js', () => {
  return {
    default: vi.fn().mockResolvedValue('TestUser')
  }
})

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
})


import { loadExpenseData, expenseData, updateExpenseDate, monthlyExpenseSummary } from '../../../../../frontend/data/expenseData.js';
import { myExpenseChart } from '../../../../../frontend/script/chartJS/expense-page/expense-page-chart.js';
import { iconPicker } from '../../../../../frontend/script/utils/icon-picker.js';
import { menuIcon } from '../../../../../frontend/script/utils/menuIcon.js';
import { formatCurrency, loadGetSymbol } from '../../../../../frontend/script/utils/currencySymbols.js';
import getAccessToken from '../../../../../frontend/script/utils/getAccessToken.js';
import logOut from '../../../../../frontend/script/logout.js';
import refreshToken from '../../../../../frontend/script/utils/refreshToken.js';
import getUsername from '../../../../../frontend/script/utils/getUsername.js';
import getFormattedDate from '../../../../../frontend/script/utils/getFormattedDate.js';
import { updateChart } from '../../../../../frontend/script/utils/updateChart.js';




beforeAll(() => {
  if (typeof HTMLDialogElement !== 'undefined') {
    HTMLDialogElement.prototype.show = vi.fn(function () {
      this.open = true;
    });
    HTMLDialogElement.prototype.showModal = vi.fn(function () {
      this.open = true;
    });
    HTMLDialogElement.prototype.close = vi.fn(function () {
      this.open = false;
    });
  }
});


beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  
  fakeData.length = 0;
  fakeData.push(...baseFakeData)
})

async function setUpExpensePageDOM() {

  document.body.innerHTML = `

  <!--Profile picture -->
  <div class="profile-name profile-name-js"></div>

  <!--open popUp/form button-->
  <button class="add-expense-button js-add-expense-button" type="button" aria-controls="add-expense-dialog" aria-haspopup="dialog">&#43; Add Expense</button>

  <!--popUp/dialog form-->
  <dialog id="add-expense-dialog" class="js-add-expense-dialog" aria-labelledby="add-expense-title" aria-modal="true">
    <form class="add-expense-form js-add-expense-form">
      <div class="add-expense-header">
        <h2 id="add-expense-title" class="add-expense-header-title">Add Expense</h2>
        <button class="add-expense-popup-close-button js-add-expense-popup-close" type="button" aria-label="Close">&times;</button>
      </div>
      <hr>
      
      <div class="input-grid">
        <div class="emoji-picker-grid">

          <div class="emoji-picker-inner-grid">
            <button type="button" class="emoji-picker-btn" aria-label="Emoji picker" aria-controls="emoji-picker-element" aria-expanded="false"><img class="emoji-picker js-emoji-picker" src="icons/emoji-picker.png" alt=""></button>
            
            <div id="emoji-picker-element" class="js-emoji-picker-element"></div>
            <label for="emoji-input" class="pick-icon">Pick Icon</label>
            <input maxlength="2" id="emoji-input" class=" emoji-picked js-emoji-picked" name="emoji" tabindex="-1" autocomplete="off">
          </div>

          <label class="expense-category"> 
            Category:
            <select   name="category" class="category-input" aria-describedby="category-error">
              <option value="" selected disabled>Select a category</option>
              <option value="Food & Groceries">Food & Groceries</option>
              <option value="Dining Out / Takeout">Dining Out / Takeout</option>
              <option value="Shopping">Shopping</option>
              <option value="Transportation">Transportation</option>
              <option value="Health">Health</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Travel">Travel</option>
              <option value="Education">Education</option>
              <option value="Housing">Housing</option>
              <option value="Other-Expense">Other-Expense</option>
            </select>
          </label>
        </div>

        <div id="category-error" class="category-input-alert js-category-input-alert"></div>

      
        <div class="add-expense-inputs">
          <label for="expense-source-input">Expense Source</label>
          <input id="expense-source-input" class="add-expense-input-element js-expense-value" type="text" name="expenseSourceValue" aria-describedby="expense-source-error">
          <div id="expense-source-error" class="expense-source-input-alert js-expense-source-input-alert"></div>
        </div>

        <div class="add-expense-inputs">
          <label for="expense-amount-input">Amount</label>
          <input id="expense-amount-input" class="add-expense-input-element js-amount-value " type="number" min="0" step="1" name="amountValue" oninput="this.value = this.value.replace(/[^0-9]/g,'')" aria-describedby="expense-amount-error">
          <div id="expense-amount-error" class="expense-amount-input-alert js-expense-amount-input-alert"></div>
        </div>

        <div class="add-expense-inputs">
          <label for="date-input">Date</label>
          <input id="date-input" class="add-expense-input-element js-date-value" type="date" name="dateValue" aria-describedby="date-input-error">
          <div id="date-input-error" class="expense-date-input-alert js-expense-date-input-alert"></div>
        </div>

        <div class="right-align">
          <button class="add-expense-button-submit js-add-expense-button-submit" type="submit">Add Expense</button>
        </div>

      </div>

    </form>
  </dialog>
  
  <!--Expense list-->
  <ol class="each-expense-grid js-each-expense-grid"></ol>
  `

  await import ('../../../../../frontend/script/expense-page/expense.js')
}


describe('Expense page integrated tests', () => {

  it('should render loaded expense data correctly', async () => {

    await setUpExpensePageDOM();

    expect(iconPicker).toHaveBeenCalled();
    expect(loadExpenseData).toHaveBeenCalled();
    expect(loadGetSymbol).toHaveBeenCalled();
    expect(updateExpenseDate).toHaveBeenCalled();
    expect(getFormattedDate).toHaveBeenCalledWith('2025-09-09');

    // Verify expense list
    const listItems = await screen.findAllByRole('listitem')
    
    expect(listItems).toHaveLength(2);

    // Verify first expense
    const firstDelBtn = within(listItems[0]).getByRole('button', {name: /delete expense/i})

    expect(firstDelBtn).toHaveAttribute('data-id', '691234678944c535c901e682' )
    expect(listItems[0]).toHaveTextContent('Clothes')
    expect(listItems[0]).toHaveTextContent('Category: Shopping')
    expect(listItems[0]).toHaveTextContent('-10000 Kč')
    expect(listItems[0]).toHaveTextContent('10-10-2025')

    // Verify second expense

    
    const secondDelBtn = within(listItems[1]).getByRole('button', {name: /delete expense/i})

    expect(secondDelBtn).toHaveAttribute('data-id', '691234678944c535c901e582' )
    expect(listItems[1]).toHaveTextContent('Steak house')
    expect(listItems[1]).toHaveTextContent('Category: Food & Groceries')
    expect(listItems[1]).toHaveTextContent('-5000 Kč')
    expect(listItems[1]).toHaveTextContent('09-09-2025')
  });

  it('should add expense and display it correctly in the list', async () => {

    global.fetch = vi.fn().mockImplementation((url, options) => {
      if (url.includes('/expenses') && options?.method === 'POST') {
        const body = JSON.parse(options.body);

        fakeData.push({
          ...body,
          user: "6893682cc44043ab368bd87f",
          __v: 0, 
          _id: "691234678944c535c901e782"
        })

        return {ok: true, status: 200};
      }

      return {ok: true, status: 200};
    })

    await setUpExpensePageDOM();
    
    const user = userEvent.setup();

    const addExpenseDialog = screen.getByRole('button', {name: /\+ add expense/i});

    const dialog = document.getElementById('add-expense-dialog');


    await user.click(addExpenseDialog);

    expect(dialog.showModal).toHaveBeenCalled()

   
    // Verify category select
    const categoryInput = screen.getByLabelText(/category/i)
    await user.selectOptions(categoryInput, 'Travel')
    expect(categoryInput.value).toBe('Travel')

    // Verify expense source
    const expenseSourceInput = screen.getByLabelText(/expense source/i);
    await user.type(expenseSourceInput, 'Skiathos');
    expect(expenseSourceInput.value).toBe('Skiathos');

    // Verify amount
    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, '46000');
    expect(amountInput.value).toBe('46000')

    // Verify date
    const dateInput = screen.getByLabelText(/date/i);
    await user.type(dateInput, '2025-11-11');
    expect(dateInput.value).toBe('2025-11-11');

    const parentDiv = document.querySelector('.right-align');
    const submitBtn = within(parentDiv).getByRole('button', {name: /add expense/i});

    await user.click(submitBtn);

    const newExpense = {
      category: categoryInput.value,
      expenseSourceValue: expenseSourceInput.value,
      amountValue: Number(amountInput.value),
      currency: 'CZK',
      dateValue: dateInput.value,
      emoji: ''
    }

    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,'http://localhost:3000/expenses',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer FAKE_ACCESS_TOKEN`
        },
        body: JSON.stringify(newExpense)
      })
    );
    expect(refreshToken).not.toHaveBeenCalled();
    expect(monthlyExpenseSummary).toHaveBeenCalled();
    expect(updateChart).toHaveBeenCalled();
    expect(updateExpenseDate).toHaveBeenCalled();
    expect(dialog.close).toHaveBeenCalled();


    const listItems = await screen.findAllByRole('listitem');

    expect(listItems).toHaveLength(3);

    const thirdDelBtn = within(listItems[0]).getByRole('button', {name: /delete expense/i});
    expect(thirdDelBtn).toHaveAttribute('data-id', '691234678944c535c901e782')
    expect(listItems[0]).toHaveTextContent('Skiathos');
    expect(listItems[0]).toHaveTextContent('Travel');
    expect(listItems[0]).toHaveTextContent('-46000 Kč');
    expect(listItems[0]).toHaveTextContent('11-11-2025');
  });

  test('deletes expense and display the correct amount of income', async () => {

    global.fetch = vi.fn().mockImplementation((url, options) => {
      if (url.includes('/expenses/691234678944c535c901e682') && options?.method === 'DELETE') {

        const newData = fakeData.filter((data) => {
          return data._id !== '691234678944c535c901e682'
        })

        fakeData.length = 0;

        fakeData.push(...newData)
        return {ok: true, status: 200}
      }

      return {ok: true, status: 200}
    })
     
    await setUpExpensePageDOM();

    const user = userEvent.setup();

    const list = await screen.findByRole('list')
    // Verify expense list
    let listItems = await screen.findAllByRole('listitem');

    expect(listItems).toHaveLength(2);

    // console.log(list.innerHTML)
    // Verify first expense
    expect(listItems[0]).toHaveTextContent('Clothes');
    expect(listItems[0]).toHaveTextContent('Category: Shopping');
    expect(listItems[0]).toHaveTextContent('-10000 Kč');
    expect(listItems[0]).toHaveTextContent('10-10-2025');

    // Verify second expense
    expect(listItems[1]).toHaveTextContent('Steak house');
    expect(listItems[1]).toHaveTextContent('Category: Food & Groceries');
    expect(listItems[1]).toHaveTextContent('-5000 Kč');
    expect(listItems[1]).toHaveTextContent('09-09-2025');


    // Expense delete button
    const targetExpense = listItems.find((item) => {
      const btn = within(item).getByRole('button', {name: /delete expense/i});

      return btn.getAttribute('data-id') === '691234678944c535c901e682'
    })

    const delButton = within(targetExpense).getByRole('button', {name: /delete expense/i})
  
    expect(delButton).toHaveAttribute('data-id', '691234678944c535c901e682')

    await user.click(delButton);

    // Verify calls after clicking del
    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalled();
    expect(refreshToken).not.toHaveBeenCalled();
    expect(monthlyExpenseSummary).toHaveBeenCalled();
    expect(updateChart).toHaveBeenCalled();
    expect(loadExpenseData).toHaveBeenCalled();
    expect(loadGetSymbol).toHaveBeenCalled();
    expect(updateExpenseDate).toHaveBeenCalled();

    // Verify remaining expense
    listItems = await screen.findAllByRole('listitem');

    expect(listItems).toHaveLength(1);

    expect(listItems[0]).toHaveTextContent('Category: Food & Groceries');
    expect(listItems[0]).toHaveTextContent('-5000 Kč');
    expect(listItems[0]).toHaveTextContent('09-09-2025');
    expect(listItems[0]).toHaveTextContent('Steak house');
  })
});


