

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
    
    timeFromId.innerHTML = 'From<input class="time-from-js" type="date">';
    timeToId.innerHTML =  'To<input class="time-to-js" type="date">';
    
    if (timeFromId.style.display === 'block' || timeToId.style.display === 'block') {
      timeFromId.style.display = 'none';
      timeToId.style.display = 'none';
    } else {
      timeFromId.style.display = 'block';
      timeToId.style.display = 'block';
    }
  })
  
  // Time line Filter
  const filterTime = document.querySelectorAll('.filter-button-timeline')
  
  filterTime.forEach((buttonTime) => {
    buttonTime.addEventListener('click', () => {
      customTimelineClicked = false;
      timeFromId.style.display = 'none';
      timeToId.style.display = 'none';
  
      document.querySelector('.special')?.classList.remove('special');
      buttonTime.classList.add('special');
      filterTimeValue = buttonTime.value;
    })
  })
  

}  
