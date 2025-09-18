export function menuIcon() {

  const menuIconBox = document.getElementById('menu-icon-box')
  const menuIconImg = document.querySelector('#menu-icon-box img')
  const sidebar = document.getElementById('sidebar')

  const originalImg = 'icons/menu-icon.png';
  const changedImg = 'icons/menu-close-icon.png';


  console.log(menuIconBox.innerHTML)

  
  menuIconBox.addEventListener('click', () => {
    const isOpen = sidebar.classList.contains('show')

    if(!isOpen) {
      sidebar.classList.add('show');
      document.body.style.overflow = 'hidden';
      menuIconImg.src = changedImg;


    } else {
      sidebar.classList.remove('show')
      document.body.style.overflow = '';
      menuIconImg.src = originalImg;
    }
  })
}