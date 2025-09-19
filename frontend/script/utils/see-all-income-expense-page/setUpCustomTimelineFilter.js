

export let filterTimeValue;
export let customTimelineClicked;

export function setUpCustomTimelineFilter() {
  // Time line Custom
  const filterTimeCustonBtn = document.querySelector('.filter-button-timeline-custom-js')
  
  
  const timeFromId = document.getElementById('time-from');
  const timeToId = document.getElementById('time-to');
  
  filterTimeCustonBtn.addEventListener('click', () => {
    customTimelineClicked = true;
  
    document.querySelector('.special')?.classList.remove('special');
    filterTimeCustonBtn.classList.add('special');
    
    timeFromId.innerHTML = 'From <input class="time-from-input time-from-js" type="date">';
    timeToId.innerHTML =  'To <input class="time-to-input time-to-js" type="date">';
    
    if (timeFromId.classList.contains('timeFrom-display')) {
      timeFromId.classList.remove('timeFrom-display');
      timeToId.classList.remove('timeTo-display');
    } else {

      
      timeFromId.classList.add('timeFrom-display');
      timeToId.classList.add('timeTo-display');
    }
  })
  
  // Time line Filter
  const filterTime = document.querySelectorAll('.filter-button-timeline')
  
  filterTime.forEach((buttonTime) => {
    buttonTime.addEventListener('click', () => {
      customTimelineClicked = false;
      timeFromId.classList.remove('timeFrom-display');
      timeToId.classList.remove('timeTo-display');
  
      document.querySelector('.special')?.classList.remove('special');
      buttonTime.classList.add('special');
      filterTimeValue = buttonTime.value;
    })
  })
  

}  
