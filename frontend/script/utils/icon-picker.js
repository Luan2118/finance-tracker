


export function iconPicker() {
  const emojiInput = document.getElementById('emoji-input')
  
  
  const emojiPickerButton = document.querySelector('.emoji-picker-btn');
  const emojiContainer = document.querySelector('.js-emoji-picker-element');
  const emojiPickedTarget = document.querySelector('.js-emoji-picked')
  
  
  emojiPickerButton.addEventListener('click', () => {
    if(emojiContainer.classList.contains('emoji-element')) {
      emojiPickerButton.setAttribute('aria-expanded', 'false');
      emojiContainer.classList.remove('emoji-element');
      emojiContainer.innerHTML = '';
    }else {
      emojiContainer.innerHTML = '<emoji-picker class="emoji light"></emoji-picker>'
      emojiContainer.classList.add('emoji-element');
      emojiPickerButton.setAttribute('aria-expanded', 'true');
      const emojiPicker = document.querySelector('emoji-picker')
      emojiPicker.addEventListener('emoji-click',(event) => {
        emojiInput.value = '';
        emojiContainer.innerHTML = '';
        window.textFieldEdit.insert(emojiPickedTarget, event.detail.unicode)
      })
    }
  })

  
}

