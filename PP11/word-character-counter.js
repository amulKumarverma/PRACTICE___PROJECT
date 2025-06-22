let text=document.querySelector("#text-area")
console.log(text)
let char_counter=document.querySelector("#chara")
let word_counter=document.querySelector("#word")


text.addEventListener("input",function(){
let char= this.value
let char_length= char.length

char_counter.innerHTML=char_length

})



text.addEventListener("input",function(){
let word= this.value
let new_word=  word.trim()
let new_word_2= new_word.split(" ")
let final_word= new_word_2.filter(function(final_word_store){
  return final_word_store !=""
})
let word_length=final_word.length
word_counter.innerHTML=word_length

})