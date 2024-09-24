let token = localStorage.getItem("token");
if (token == null) {
    window.location.href = 'login.html';
}
document.getElementById('createRoleForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const formData = new FormData(this);
    const roleName = formData.get('role_name');
    const permissions = formData.getAll('permissions[]');
    console.log(permissions)
    let res=await fetch('/api/create-role', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            role_name: roleName,
            permissions: permissions,
            token
        })
    })
    if(res.ok){
        res=await res.json();
        await alert(res);
        window.history.back();
    }
    else{
        res=await res.json();
        alert(res);
    }
});
function dback(){
    history.back();
  }