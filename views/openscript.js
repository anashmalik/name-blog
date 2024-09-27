let token = localStorage.getItem("token");
if (token == null) {
    window.location.href = 'login';
}
async function load() {
    const token = localStorage.getItem('token')
    const urlParams = new URLSearchParams(window.location.search);
    const b_id = urlParams.get('param1');
    let aau = await fetch('/author', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });
    const auth = await aau.json();
    const pos = auth.pos;
    let aid = await fetch('/a_id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });
    const a_id = await aid.json();
    let uid = await fetch('/u_id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ b_id })
    });
    const u_id = await uid.json();
    let array = await fetch('/api/permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pos })
    })
    let ans = await array.json();
    array = [];
    ans.forEach(element => {
        array.push(element.p_id);
    });
    const but = document.getElementById('but');
    if (((array.includes(3)) && (a_id == u_id)) || array.includes(16)) {
        let add_user = document.createElement('button');
        add_user.classList.add('adbut');
        add_user.innerText = 'Edit Blog';
        add_user.style.backgroundColor = "rgb(74, 196, 74)"
        add_user.addEventListener('click', () => {
            window.location.href = `edit.html?param1=${encodeURIComponent(b_id)}`;
        })
        but.appendChild(add_user);
    }

    if (((array.includes(4)) && (a_id == u_id)) || array.includes(9)) {

        let add_user = document.createElement('button');
        add_user.classList.add('adbut');
        add_user.innerText = 'Delete Blog';
        add_user.addEventListener('click', async () => {
            const t = confirm("are you sure to delete this blog")
            if (t) {
                const res = await fetch('/api/delete', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ b_id })
                })
                console.log(res)
                if (res.ok) {
                    await alert("blog deleted")
                    window.location.href = document.referrer;
                }
                else {
                    await alert("not deleted")
                }
            }

        })
        but.appendChild(add_user);
    }
    if (((array.includes(5)) && (a_id == u_id)) || array.includes(10)) {
        add_user = document.createElement('button');
        add_user.classList.add('adbut');
        add_user.innerText = 'Deactivate Blog';
        add_user.addEventListener('click', async () => {
            const t = confirm("are you sure to deactivate this blog")
            if (t) {
                const res = await fetch('/api/BlogDe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ b_id })
                })
                console.log(res)
                if (res.ok) {
                    await alert("blog deactivated")
                    window.location.href = document.referrer;
                }
                else {
                    await alert("not deactivated")
                }
            }
        })
        but.appendChild(add_user);
    }
}
load()
function dback(){
    history.back();
  }