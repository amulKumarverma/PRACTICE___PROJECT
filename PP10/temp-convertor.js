let celcius = document.querySelector("#celcius")
let farenhite = document.querySelector("#farenhite")


celcius.addEventListener("input",function(){
  let cle_value = this.value
  farenhite.value= ((cle_value * 9/5) + 32).toFixed(4) 

  console.log("cel changed")
})


farenhite.addEventListener("input",function(){
  let farh_value = this.value
 celcius.value = ((farh_value - 32) * 5/9).toFixed(4)  

  console.log("fh changed")
})