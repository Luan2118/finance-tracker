export function menuIcon() {

  const menuIconBox = document.getElementById('menu-icon-box')
  const menuIconImg = document.querySelector('#menu-icon-box img')
  const sidebar = document.getElementById('sidebar')

  const originalHTML = menuIconBox.innerHTML;
  const changedHTML = '<img class="menu-icon js-menu-icon" src="icons/menu-close-icon.png"></img>'

  const originalImg = 'icons/menu-icon.png';
  const changedImg = 'icons/menu-close-icon.png';


  menuIconBox.addEventListener('click', () => {


    if(menuIconBox.innerHTML === originalHTML) {
      sidebar.style.display = 'block';
      document.body.style.overflow = 'hidden';
      menuIconImg.src = changedImg;
      //menuIconBox.innerHTML = changedHTML;


    } else {
      //menuIconBox.innerHTML = originalHTML;
      sidebar.style.display = 'none';
      document.body.style.overflow = '';
      menuIconImg.src = originalImg;
    }
  })
}