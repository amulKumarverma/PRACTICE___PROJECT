let username = document.querySelector("#user_name");
let password = document.querySelector("#password");

let useralert = document.querySelector("#useralert");
let passalert = document.querySelector("#passalert");





function validation() {

  let flag = 1;
  if (username.value === "") {

    useralert.innerHTML = "user name is empty"
    flag = 0

  } else if (username.value.length < 5) {
    useralert.innerHTML = "atleast five character"
    flag = 0
  } else {
    useralert.innerHTML = ""
 
  }




  if (password.value == "") {
    passalert.innerHTML = "password is empty"
    flag =0

  } else {
    passalert.innerHTML = ""

   
  }






  if (flag) {
    return true
  } else {
    return false
  }
}
