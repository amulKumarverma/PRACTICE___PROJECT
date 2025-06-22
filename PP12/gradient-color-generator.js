



function color1 (){
let red = Math.floor((Math.random()*256))
let green =Math.floor((Math.random()*256))
let blue=Math.floor((Math.random()*256))

return `${red},${green},${blue}`
}

function color2 (){
let red = Math.floor((Math.random()*256))
let green =Math.floor((Math.random()*256))
let blue=Math.floor((Math.random()*256))

return `${red},${green},${blue}`
}


function color3 (){
let red = Math.floor((Math.random()*256))
let green =Math.floor((Math.random()*256))
let blue=Math.floor((Math.random()*256))

return `${red},${green},${blue}`
}





let backcolor=document.querySelector("body")

backcolor.style.background = 
    `linear-gradient( to right ,rgb(${color1()}), rgb(${color2()}), rgb(${color3()}))`;
































