import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/dom";
import  userEvent  from '@testing-library/user-event';
import { setupCustomAmountFilter } from "../../../../../frontend/script/utils/see-all-income-expense-page/setUpCustomAmountFilter.js";


describe('setupCustomAmountFilter', () => {
  it('custom amount input should be displayed when custom button is clicked and should dissapear after clicking the same button or another amount button', async () => {

    document.body.innerHTML = `
      <button type="button" class="filter-button-amount-custom filter-button-amount-custom-js" value="custom" aria-controls="amount-range" aria-expanded="false">Custom</button>

      <fieldset id="amount-range">
        <legend class="sr-only">Amount range</legend>
        <div class="min-amount" id="min-amount"></div>
        <div class="max-amount" id="max-amount"></div>
      </fieldset>
      
      <button type="button" class="filter-button-amount filter-button-amount-first" value="5000">up to 5000Kč</button>
      
      <button type="button" class="filter-button-amount filter-button-amount-second" value="10000">up to 10000Kč</button>
      
      <button type="button" class="filter-button-amount filter-button-amount-third" value="20000">up to 20000kč</button>

      <button type="button" class="filter-button-amount" value="see-all">See all</button>

    `

    setupCustomAmountFilter();

    const filterAmountCustomBtn = screen.getByRole('button', {name: /custom/i});
    
    const user = userEvent.setup();
    
    await user.click(filterAmountCustomBtn);

    const minAmountId = document.getElementById('min-amount');
    const maxAmountId = document.getElementById('max-amount');

    expect(filterAmountCustomBtn).toHaveAttribute('aria-expanded', 'true');
    expect(filterAmountCustomBtn).toHaveClass('special2')
    expect(minAmountId).toBeVisible();
    expect(maxAmountId).toBeVisible();

    await user.click(filterAmountCustomBtn);

    expect(filterAmountCustomBtn).toHaveAttribute('aria-expanded', 'false');
    expect(filterAmountCustomBtn).not.toHaveClass('special2')
    expect(minAmountId).not.toBeVisible();
    expect(maxAmountId).not.toBeVisible();

    await user.click(filterAmountCustomBtn);

    expect(filterAmountCustomBtn).toHaveAttribute('aria-expanded', 'true');
    expect(filterAmountCustomBtn).toHaveClass('special2')
    expect(minAmountId).toBeVisible();
    expect(maxAmountId).toBeVisible();


    const amountBtn = screen.getByRole('button', {name: /up to 5000kč/i});

    await user.click(amountBtn)

    expect(filterAmountCustomBtn).toHaveAttribute('aria-expanded', 'false');
    expect(filterAmountCustomBtn).not.toHaveClass('special2')
    expect(minAmountId).not.toBeVisible();
    expect(maxAmountId).not.toBeVisible()
    expect(amountBtn).toHaveClass('special2');

  })
})


