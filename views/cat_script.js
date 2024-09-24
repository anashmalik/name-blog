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
        history.back();
    }
    else {
        let a = await re.json();
        await alert(a);
    }}
})
function dback() {
    history.back();
}