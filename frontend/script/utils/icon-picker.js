import textFieldEdit from 'https://cdn.jsdelivr.net/npm/text-field-edit@^4/index.js'


export function iconPicker() {
  const emojiInput = document.getElementById('emoji-input')

  emojiInput.addEventListener('keydown', (event) => {
    const allowedKeys = [
      'Backspace'
    ]

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  })

  const emojiPickerButton = document.querySelector('.js-emoji-picker');
  const emojiContainer = document.querySelector('.js-emoji-picker-element');
  const emojiPickedTarget = document.querySelector('.js-emoji-picked')

  emojiPickerButton.addEventListener('click', () => {
      emojiContainer.innerHTML = '<emoji-picker class="emoji-element light"></emoji-picker>'


      const emojiPicker = document.querySelector('emoji-picker')
      emojiPicker.addEventListener('emoji-click',(event) => {
      emojiInput.value = '';
      emojiContainer.innerHTML = '';
      textFieldEdit.insert(emojiPickedTarget, event.detail.unicode)
    })
    })
}