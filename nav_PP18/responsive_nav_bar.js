let toggleBtn = document.querySelector('.toggle-menu');

let toggleBtnClose = document.querySelector('.close');
let menu = document.querySelector('.menu');


toggleBtn.addEventListener('click', () => {
  menu.classList.add('active');
  toggleBtn.classList.add("hidemenu")
  toggleBtnClose.classList.remove("hideclose")

});


toggleBtnClose.addEventListener('click', () => {
  menu.classList.remove('active');
toggleBtnClose.classList.add("hideclose")
 toggleBtn.classList.remove("hidemenu")
});
