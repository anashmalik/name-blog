let token = localStorage.getItem("token");
if (token == null) {
    window.location.href = 'login';
}
async function role() {
  var select = document.getElementById("role");
let res = await fetch('/api/all_role',{
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
});
if(res.ok){
  res= await res.json();
  let i=0;
  
  res.forEach(ele => {
    var newOption = document.createElement("option");
    newOption.value = ele.r_id;
    newOption.text = ele.name;
    select.appendChild(newOption);
  });
}
}

async function load(event) {
    event.preventDefault();
        if(!token){
            window.location.href= 'login';
        }
      let aau=await fetch('/author',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if(aau.ok){
        const pos=await aau.json();
        const name =  document.getElementById('name').value;
        const username = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const position = document.getElementById('role').value;
        if(password!=confirmPassword){
          document.getElementById('notmatch').innerText="confirm password in not same"
        }
        else{
        const response =await fetch('/add_user',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name,username, password,position,token,confirmPassword })
        })
        if(response.ok){
            const b=await response.json()
            await alert(b.message)
            window.location.href="/home";
          }
          else{
            const error=await response.json()
            
            alert(error.message);
          }
        }
      }
} 
document.getElementById('add-user-form').addEventListener('submit',()=>load(event));
role()
function dback(){
  history.back();
}