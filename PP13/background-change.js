let  light= document.querySelector(".light")
let night =document.querySelector(".night")

let body_change = document.querySelector("body")


light.addEventListener("click", function (){
  body_change.style.background="white"
  document.querySelector("p").style.color="black"
})

night.addEventListener("click", function (){
  body_change.style.background="black"

    document.querySelector("p").style.color="white"
   
})