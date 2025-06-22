
  let nav_sticky = document.querySelector("nav")
window.addEventListener("scroll", function(){

  if (window.pageYOffset>100) {
    nav_sticky.classList.add("sticky")
  }else{
    nav_sticky.classList.remove("sticky")
  }
})