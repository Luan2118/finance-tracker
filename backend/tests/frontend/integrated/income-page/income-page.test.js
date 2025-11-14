import {describe, it, beforeAll, expect, vi, beforeEach} from 'vitest';
import {screen, within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

// IncomeData mocks

let fakeData = vi.hoisted(() => {
  return [
    {amountValue: 10000, category: "Part-Time", currency: "CZK", dateValue: "2025-09-09", emoji: "", incomeSourceValue: "Part-Time", user: "6893682cc44043ab368bd87f",__v: 0, _id: "68c9c6dffcac0f995236cdb9"},
    {amountValue: 15000, category: "Salary", currency: "CZK", dateValue: "2025-10-10", emoji: "", incomeSourceValue: "Salary", user: "6893682cc44043ab368bd87f",__v: 0, _id: "68c9c6dffcac0f995236cdb10"}
  ]
})

const baseFakeData =  [
    {amountValue: 10000, category: "Part-Time", currency: "CZK", dateValue: "2025-09-09", emoji: "", incomeSourceValue: "Part-Time", user: "6893682cc44043ab368bd87f",__v: 0, _id: "68c9c6dffcac0f995236cdb9"},
    {amountValue: 15000, category: "Salary", currency: "CZK", dateValue: "2025-10-10", emoji: "", incomeSourceValue: "Salary", user: "6893682cc44043ab368bd87f",__v: 0, _id: "68c9c6dffcac0f995236cdb10"},
  ];


vi.mock('../../../../../frontend/data/incomeData.js', () => {

  const fakeMonthlySum = {'2025-09': 10000, '2025-10': 15000}
  const loadIncomeData = vi.fn().mockResolvedValue(fakeData);
  return {
    incomeData: fakeData,
    loadIncomeData,
    monthlyIncomeSummary: vi.fn().mockResolvedValue(fakeMonthlySum),
    updateIncomeDate: vi.fn().mockImplementation(() => {
      fakeData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
    })
  }
  
})

// Chart mock
vi.mock('../../../../../frontend/script/chartJS/income-page/income-page-chart.js', () => {
  return {
    myChart: null
  }
});

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

import { incomeData, loadIncomeData, updateIncomeDate, monthlyIncomeSummary } from '../../../../../frontend/data/incomeData.js';
import { myChart } from '../../../../../frontend/script/chartJS/income-page/income-page-chart.js';
import { iconPicker } from '../../../../../frontend/script/utils/icon-picker.js';
import { menuIcon } from '../../../../../frontend/script/utils/menuIcon.js';
import { formatCurrency, loadGetSymbol } from '../../../../../frontend/script/utils/currencySymbols.js';
import refreshToken from '../../../../../frontend/script/utils/refreshToken.js';
import getAccessToken from '../../../../../frontend/script/utils/getAccessToken.js';
import { updateChart } from '../../../../../frontend/script/utils/updateChart.js';
import getUsername from '../../../../../frontend/script/utils/getUsername.js';


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
  delete global.fetch;
  
  fakeData.length = 0;
  fakeData.push(...baseFakeData);
})

async function setUpIncomePageDOM() {
  document.body.innerHTML = `

    <!--Profile name-->
    <div class="profile-name profile-name-js"></div>
    
    <!-- Open popup/form button -->
    <button type="button"  class="add-income-button js-add-income-button" aria-controls="add-income-dialog" aria-haspopup="dialog">&#43; Add Income</button>


    <!-- Pop up dialog -->
    <dialog id="add-income-dialog" aria-labelledby="add-income-title" aria-modal="true">
      <form class="add-income-form" id="income-submit-form">
        <div class="add-income-header">
          <h2 id="add-income-title" class="add-income-header-title">Add Income</h2>
          <button class="add-income-popup-close-button js-add-income-popup-close" type="button" aria-label="Close">&times;</button>
        </div>
        <hr>
        
        <div class="input-grid">
          <div class="emoji-picker-grid">

            <div class="emoji-picker-inner-grid">
              <button type="button" class="emoji-picker-btn" aria-label="Emoji picker" aria-controls="emoji-picker-element" aria-expanded="false"><img class="emoji-picker js-emoji-picker" src="icons/emoji-picker.png" alt="" ></button>

              <div id="emoji-picker-element" class="js-emoji-picker-element"></div>
              <label for="emoji-input" class="pick-icon">Pick Icon</label>
              <input maxlength="2" id="emoji-input" class=" emoji-picked js-emoji-picked" tabindex="-1" autocomplete="off">
            </div>

            <label class="income-category">
              Category:
              <select  class="category-input"  name="category" aria-describedby="category-error" >
                <option value="" selected disabled>Select a category</option>
                <option value="Salary">Salary</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Overtime">Overtime</option>
                <option value="Interest">Interest</option>
                <option value="Other-Income">Other-Income</option>
              </select>
            </label>
          </div>

          <div id="category-error" class="category-input-alert js-category-input-alert"></div>
          
          <div class="add-income-inputs">
            <label for="income-source-input">Income Source</label>
            <input id="income-source-input" class="add-income-input-element income-input-js" type="text" name="incomeValue" aria-describedby="income-error"  >
            <div id="income-error" class="income-source-input-alert js-income-source-input-alert"></div>
          </div>

          <div class="add-income-inputs">
            <label for="income-amount-input">Amount</label>
            <input id="income-amount-input" class="add-income-input-element amount-input-js " type="number" min="1"  aria-describedby="amount-error" name="amountValue">
            <div id="amount-error" class="income-amount-input-alert js-income-amount-input-alert"></div>
          </div>

          <div class="add-income-inputs">
            <label for="date-input">Date</label>
            <input id="date-input" class="add-income-input-element date-input-js" type="date"  aria-describedby="date-error" name="dateValue">
            <div id="date-error" class="income-date-input-alert js-income-date-input-alert"></div>
          </div>

          <div class="right-align">
            <button class="add-income-button-submit js-add-income-button-submit right-align" type="submit">Add Income</button>
          </div>

        </div>

      </form>
    </dialog>

    <!-- Income List -->
    <ol class="each-income-grid js-each-income-grid" id="submit"></ol>
    `

    await import('../../../../../frontend/script/income-page/income.js');

}



describe('Income Page Integrated Tests', () => {

   it('should display loaded existing income', async () => {

    await setUpIncomePageDOM();

    expect(iconPicker).toHaveBeenCalled();
    expect(loadIncomeData).toHaveBeenCalled();
    expect(loadGetSymbol).toHaveBeenCalledWith(incomeData);
    expect(updateIncomeDate).toHaveBeenCalled();

    // Verify income list
    const listItems =  await screen.findAllByRole('listitem');
    expect(listItems).toHaveLength(2);

    
    
    // Verify first income item
    const firstDelBtn = within(listItems[0]).getByRole('button', {name: /delete income/i})
    expect(firstDelBtn).toHaveAttribute('data-id', '68c9c6dffcac0f995236cdb10')
    expect(listItems[0]).toHaveTextContent('10-10-2025')
    expect(listItems[0]).toHaveTextContent('Salary')
    expect(listItems[0]).toHaveTextContent('15000 Kč')
    expect(listItems[0]).toHaveTextContent('Category: Salary')



    // Verify second income item
    const secondDelBtn = within(listItems[1]).getByRole('button', {name: /delete income/i})
    expect(secondDelBtn).toHaveAttribute('data-id', '68c9c6dffcac0f995236cdb9')
    expect(listItems[1]).toHaveTextContent('09-09-2025')
    expect(listItems[1]).toHaveTextContent('Part-Time')
    expect(listItems[1]).toHaveTextContent('10000 Kč')
    expect(listItems[1]).toHaveTextContent('Category: Part-Time')

  });

  it('should add income and display it in the list', async () => {

    await setUpIncomePageDOM();
    
    expect(iconPicker).toHaveBeenCalled();
    
    global.fetch = vi.fn().mockImplementation(async (url, options) => {
      if (url.includes('/income') && options?.method === 'POST') {
        const body = JSON.parse(options.body);
        fakeData.push({
          ...body,
          _id: '68c9c6dffcac0f995236cdb11',
          user: "6893682cc44043ab368bd87f",
          __v: 0,
        });
        
        
        return { ok: true, status: 200 };
      }
      
      return { ok: true, status: 200 };
    });
    
   
    const user = userEvent.setup();
    
   
    // open popUp form
    const addIncomePopup = screen.getByRole('button', {name:/\+ add income/i});
    const dialog = document.getElementById('add-income-dialog');

    await user.click(addIncomePopup);

    expect(dialog.showModal).toHaveBeenCalled();

    // emoji picker
    const emojiPickerButton = screen.getByRole('button', {name: /emoji picker/i});
    await user.click(emojiPickerButton);
    

    // category select
    const selectInput = screen.getByLabelText(/category/i);
    await user.selectOptions(selectInput, 'Salary');
    expect(selectInput.value).toBe('Salary');

    // income source input
    const incomeSourceInput = screen.getByLabelText(/income source/i);
    await user.type(incomeSourceInput, 'Salary');
    expect(incomeSourceInput.value).toBe('Salary');

    // amount input
    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, '30000');
    expect(amountInput.value).toBe('30000');
  
    // date input
    const dateInput = screen.getByLabelText(/date/i);
    await user.type(dateInput, '2025-11-11');
    expect(dateInput.value).toBe('2025-11-11');

    //submit button
    const parentDiv = document.querySelector('.right-align')
    const submitButton = within(parentDiv).getByRole('button', {name: /add income/i})

    
    await user.click(submitButton);
    
    
    // submitIncome calls
    const newIncome = {
      category: selectInput.value,
      incomeSourceValue: incomeSourceInput.value,
      amountValue: Number(amountInput.value),
      currency: 'CZK',
      dateValue: dateInput.value,
      emoji: ''
    }
    
    expect(global.fetch).toHaveBeenCalledTimes(1);

    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(refreshToken).not.toHaveBeenCalled();
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,'http://localhost:3000/income',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer FAKE_ACCESS_TOKEN`
        },
        body: JSON.stringify(newIncome)
      })
    )
    expect(monthlyIncomeSummary).toHaveBeenCalledTimes(1);
    expect(updateChart).toHaveBeenCalledTimes(1);
    expect(dialog.close).toHaveBeenCalled();
    expect(updateIncomeDate).toHaveBeenCalled();

    
    const listItems =  await screen.findAllByRole('listitem');
    expect(listItems).toHaveLength(3);

    // Verify added income
    const thirdDelBtn = within(listItems[0]).getByRole('button', {name: /delete income/i})
    expect(thirdDelBtn).toHaveAttribute('data-id', '68c9c6dffcac0f995236cdb11')
    expect(listItems[0]).toHaveTextContent('11-11-2025')
    expect(listItems[0]).toHaveTextContent('Salary')
    expect(listItems[0]).toHaveTextContent('30000 Kč')
    expect(listItems[0]).toHaveTextContent('Category: Salary')
  });

  it('deletes income and display the correct amount of income', async () => {
  
    global.fetch = vi.fn().mockImplementation( (url, options) => {
      if(url.includes('income/68c9c6dffcac0f995236cdb10') && options?.method === 'DELETE') {
        
        const newData = fakeData.filter(data => data._id !== '68c9c6dffcac0f995236cdb10') 
        
        fakeData.length = 0;

        fakeData.push(...newData)
        return {ok:true, status: 200};
      }
       return {ok:true, status: 200};
    })


    await setUpIncomePageDOM();


    const user = userEvent.setup();

    // Verify income list
    let listItems = await screen.findAllByRole('listitem');
    expect(listItems).toHaveLength(2);

    // Verify first income
    expect(listItems[0]).toHaveTextContent('Category: Salary');
    expect(listItems[0]).toHaveTextContent('Salary');
    expect(listItems[0]).toHaveTextContent('10-10-2025');
    expect(listItems[0]).toHaveTextContent('+15000 Kč');

    // Verify second income
    expect(listItems[1]).toHaveTextContent('Category: Part-Time');
    expect(listItems[1]).toHaveTextContent('Part-Time');
    expect(listItems[1]).toHaveTextContent('09-09-2025');
    expect(listItems[1]).toHaveTextContent('+10000 Kč');

    // income delete button
    const targetIncome = listItems.find((list) => {
      const btn = within(list).getByRole('button', {name: /delete income/i});

      return btn.getAttribute('data-id') === '68c9c6dffcac0f995236cdb10'
    })

    const deletedExpenseBtn = within(targetIncome).getByRole('button', {name: /delete income/i});

    expect(deletedExpenseBtn).toHaveAttribute('data-id', '68c9c6dffcac0f995236cdb10');

   
    await user.click(deletedExpenseBtn);

    // verify calls after clicking del btn
    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenNthCalledWith(
      1, 'http://localhost:3000/income/68c9c6dffcac0f995236cdb10',
      expect.objectContaining({
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer FAKE_ACCESS_TOKEN`
        }
      })
    )    
    expect(refreshToken).not.toHaveBeenCalled();
    expect(monthlyIncomeSummary).toHaveBeenCalled();
    expect(updateChart).toHaveBeenCalled();
    expect(updateIncomeDate).toHaveBeenCalled();

    expect(loadIncomeData).toHaveBeenCalled();
    expect(loadGetSymbol).toHaveBeenCalled();
    

    // verify income list after deleting
    listItems = await screen.findAllByRole('listitem');

    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent('+10000 Kč');
    expect(listItems[0]).toHaveTextContent('09-09-2025');
    expect(listItems[0]).toHaveTextContent('Part-Time');
    expect(listItems[0]).toHaveTextContent('Category: Part-Time');

    const delButton = within(listItems[0]).getByRole('button', {name: /delete income/i});
    
    expect(delButton).toHaveAttribute('data-id', '68c9c6dffcac0f995236cdb9');

    expect(deletedExpenseBtn).not.toBeInTheDocument();
  })

  it('should add income after hitting 401 error and call refreshToken and display updated list', async () => {
    
    await setUpIncomePageDOM();
    
    expect(iconPicker).toHaveBeenCalled();
    
    global.fetch = vi.fn()
    .mockImplementationOnce(() => Promise.resolve({ok: false, status: 401}))
    .mockImplementation(async (url, options) => {
      if (url.includes('/income') && options?.method === 'POST') {
        const body = JSON.parse(options.body);
        fakeData.push({
          ...body,
          _id: '68c9c6dffcac0f995236cdb11',
          user: "6893682cc44043ab368bd87f",
          __v: 0,
        });
        
        
        return { ok: true, status: 200 };
      }
      
      return { ok: true, status: 200 };
    })
    
   
    const user = userEvent.setup();
    
   
    // open popUp form
    const addIncomePopup = screen.getByRole('button', {name:/\+ add income/i});
    const dialog = document.getElementById('add-income-dialog');

    await user.click(addIncomePopup);

    expect(dialog.showModal).toHaveBeenCalled();

    // emoji picker
    const emojiPickerButton = screen.getByRole('button', {name: /emoji picker/i});
    await user.click(emojiPickerButton);
    

    // category select
    const selectInput = screen.getByLabelText(/category/i);
    await user.selectOptions(selectInput, 'Salary');
    expect(selectInput.value).toBe('Salary');

    // income source input
    const incomeSourceInput = screen.getByLabelText(/income source/i);
    await user.type(incomeSourceInput, 'Salary');
    expect(incomeSourceInput.value).toBe('Salary');

    // amount input
    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, '30000');
    expect(amountInput.value).toBe('30000');
  
    // date input
    const dateInput = screen.getByLabelText(/date/i);
    await user.type(dateInput, '2025-11-11');
    expect(dateInput.value).toBe('2025-11-11');

    //submit button
    const parentDiv = document.querySelector('.right-align')
    const submitButton = within(parentDiv).getByRole('button', {name: /add income/i})

    
    await user.click(submitButton);
    
    
    // submitIncome calls
    const newIncome = {
      category: selectInput.value,
      incomeSourceValue: incomeSourceInput.value,
      amountValue: Number(amountInput.value),
      currency: 'CZK',
      dateValue: dateInput.value,
      emoji: ''
    }
    
    expect(global.fetch).toHaveBeenCalledTimes(2);

    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,'http://localhost:3000/income',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer FAKE_ACCESS_TOKEN`
        },
        body: JSON.stringify(newIncome)
      })
    );
    expect(getAccessToken).toHaveBeenCalledBefore(refreshToken);
    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,'http://localhost:3000/income',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer NEW_FAKE_ACCESS_TOKEN`
        },
        body: JSON.stringify(newIncome)
      })
    )
    expect(monthlyIncomeSummary).toHaveBeenCalledTimes(1);
    expect(updateChart).toHaveBeenCalledTimes(1);
    expect(dialog.close).toHaveBeenCalled();
    expect(updateIncomeDate).toHaveBeenCalled();

    
    const listItems =  await screen.findAllByRole('listitem');
    expect(listItems).toHaveLength(3);

    // Verify added income
    const thirdDelBtn = within(listItems[0]).getByRole('button', {name: /delete income/i})
    expect(thirdDelBtn).toHaveAttribute('data-id', '68c9c6dffcac0f995236cdb11')
    expect(listItems[0]).toHaveTextContent('11-11-2025')
    expect(listItems[0]).toHaveTextContent('Salary')
    expect(listItems[0]).toHaveTextContent('30000 Kč')
    expect(listItems[0]).toHaveTextContent('Category: Salary')
  })
});

