let hr =0
let min =0 
let sec =0
let milisec =0 

let whenStart=false



function start(){
  whenStart=true
  main()
}


function stop(){
  whenStart=false
}


function reset(){
  whenStart=false
hr =0
min =0 
sec =0
milisec =0 
document.querySelector("#milisec").innerHTML="00"
document.querySelector("#sec").innerHTML="00"
document.querySelector("#min").innerHTML="00"
document.querySelector("#hr").innerHTML="00"
}


function main(){
  if (whenStart==true) {
    milisec=milisec+1
   
  
  if (milisec==100) {
  sec=sec+1
  milisec =0
    
  }
  if (sec==60) {
   min=min+1
    sec=0
  }
  if (min==60) {
    hr=hr+1
    min=0
    sec=0
  }

let hrst =hr
let minst =min
let secst =sec
let milisecst =milisec 

  if (hr<10) {
    hrst ="0"+hrst
  }
  if (sec<10) {
    secst ="0"+secst
  }
  if (min<10) {
    minst ="0"+minst
  }
  if (milisec<10) {
    milisecst ="0"+milisecst
  }

   document.querySelector("#milisec").innerHTML=milisecst
document.querySelector("#sec").innerHTML=secst
document.querySelector("#min").innerHTML=minst
document.querySelector("#hr").innerHTML=hrst
 
}
}
 setInterval(main,10)


