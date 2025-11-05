export function menuIcon() {

  const menuIconBox = document.getElementById('menu-icon-box')
  const menuIconImg = document.querySelector('#menu-icon-box img')
  const sidebar = document.getElementById('sidebar')

  const originalImg = 'icons/menu-icon.png';
  const changedImg = 'icons/menu-close-icon.png';


  
  menuIconBox.addEventListener('click', () => {
    const isOpen = sidebar.classList.contains('is-open')

    if(!isOpen) {
      menuIconBox.setAttribute('aria-label', 'Open menu');
      sidebar.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      menuIconImg.src = changedImg;
      menuIconBox.setAttribute('aria-expanded', 'true')


    } else {
      menuIconBox.setAttribute('aria-label', 'Close menu');
      sidebar.classList.remove('is-open');
      document.body.style.overflow = '';
      menuIconImg.src = originalImg;
      menuIconBox.setAttribute('aria-expanded', 'false')
    }
  })
}