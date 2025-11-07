import {describe, it, expect, beforeEach, vi} from 'vitest';
import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { setUpCustomTimelineFilter } from '../../../../../frontend/script/utils/see-all-income-expense-page/setUpCustomTimelineFilter.js';


describe('setUpCustomTimelineFilter', () => {
  it('custom timeline input should be displayed when custom button is clicked and should dissapear after clicking the same button or another timeline button', async () => {

    document.body.innerHTML = `

      <button type="button" class="filter-button-timeline-custom filter-button-timeline-custom-js"  value="custom" aria-controls="date-range" aria-expanded="false">Custom</button>

      <fieldset id="date-range">
        <legend class="sr-only">Date range</legend>
        <div class="time-from" id="time-from"></div>
        <div class="time-to" id="time-to"></div>
      </fieldset>

      <button type="button" class="filter-button-timeline"  value="7">Last 7 days</button>
                  
      <button type="button" class="filter-button-timeline"  value="30">Last 30 days</button>
      
      <button type="button" class="filter-button-timeline"  value="60">Last 60 days</button>
      
      <button type="button" class="filter-button-timeline" value="see-all">See all</button>
    `
    setUpCustomTimelineFilter();

    const user = userEvent.setup();

    const customBtn = screen.getByRole('button', {name: /custom/i})

    
    await user.click(customBtn);

    const timeFromId = document.getElementById('time-from')
    const timeToId = document.getElementById('time-to');

    expect(customBtn).toHaveAttribute('aria-expanded', 'true');
    expect(customBtn).toHaveClass('special');
    expect(timeFromId).toHaveClass('timeFrom-display');
    expect(timeToId).toHaveClass('timeTo-display');


    await user.click(customBtn);
    expect(customBtn).toHaveAttribute('aria-expanded', 'false');
    expect(customBtn).not.toHaveClass('special');
    expect(timeFromId).not.toHaveClass('timeFrom-display');
    expect(timeToId).not.toHaveClass('timeTo-display');


    
    await user.click(customBtn);
    expect(customBtn).toHaveAttribute('aria-expanded', 'true');
    expect(customBtn).toHaveClass('special');
    expect(timeFromId).toHaveClass('timeFrom-display');
    expect(timeToId).toHaveClass('timeTo-display');

    const timeLineBtn = screen.getByRole('button', {name: /last 7 days/i})

    await user.click(timeLineBtn);
    expect(customBtn).toHaveAttribute('aria-expanded', 'false');
    expect(timeFromId).not.toHaveClass('timeFrom-display');
    expect(timeToId).not.toHaveClass('timeTo-display');
    expect(customBtn).not.toHaveClass('special');
    expect(timeLineBtn).toHaveClass('special');
  });

});