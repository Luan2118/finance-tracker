

export let filterTimeValue;
export let customTimelineClicked;
export let filterTimelineBtnsClicked;

export function setUpCustomTimelineFilter() {
  // Time line Custom
  const filterTimeCustomBtn = document.querySelector('.filter-button-timeline-custom-js')
  
  
  const timeFromId = document.getElementById('time-from');
  const timeToId = document.getElementById('time-to');
  
  filterTimeCustomBtn.addEventListener('click', () => {
    customTimelineClicked = true;
    filterTimelineBtnsClicked = false;
    filterTimeCustomBtn.setAttribute('aria-expanded', 'true');
    document.querySelector('.special')?.classList.remove('special');
    filterTimeCustomBtn.classList.add('special');
    
    timeFromId.innerHTML = '<label>From <input class="time-from-input time-from-js" type="date"></label>';
    timeToId.innerHTML =  '<label>To <input class="time-to-input time-to-js" type="date"></label>';
    
    if (timeFromId.classList.contains('timeFrom-display')) {
      customTimelineClicked = false;
      document.querySelector('.special')?.classList.remove('special');
      filterTimeCustomBtn.setAttribute('aria-expanded', 'false');
      timeFromId.classList.remove('timeFrom-display');
      timeToId.classList.remove('timeTo-display');
    } else {
      customTimelineClicked = true;
      filterTimelineBtnsClicked = false;
      timeFromId.classList.add('timeFrom-display');
      timeToId.classList.add('timeTo-display');
    }
})
  
  // Time line Filter
  const filterTimeBtns = document.querySelectorAll('.filter-button-timeline')
  
  filterTimeBtns.forEach((button) => {
    button.addEventListener('click', () => {
      filterTimelineBtnsClicked = true;
      customTimelineClicked = false;
      filterTimeCustomBtn.setAttribute('aria-expanded', 'false');
      timeFromId.classList.remove('timeFrom-display');
      timeToId.classList.remove('timeTo-display');
  
      document.querySelector('.special')?.classList.remove('special');
      button.classList.add('special');
      filterTimeValue = button.value;
    })
  })
  
}  
