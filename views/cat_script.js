const f = document.getElementById('cate');
f.addEventListener('submit', async () => {
    const catt = document.getElementById('category').value;
    t= await confirm(`Are you sure you want to create ${catt} category`)
    if(t){
    console.log(catt)
    const re = await fetch('/add/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catt })
    })
    if (re.ok) {
        let a = await re.json();
        await alert(a);
        location.reload();
    }
    else {
        let a = await re.json();
        await alert(a);
    }}
})
function dback() {
    history.back();
}

 async function delete_cat(name){
    console.log(name)
let re =await fetch('/delete_cat',{
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
});
if(re.ok){
    re=await re.json();
    await alert(re)
    location.reload();
}
else{
    await  alert("not deleted")
}
}