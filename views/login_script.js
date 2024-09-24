
{
    // console.log("mod to")
    loginForm.addEventListener('submit', async (e) => {
        // console.log("lolololo")
        e.preventDefault();
        const username = document.getElementById('email').value;
        const password = document.getElementById('pass').value;
        console.log(username, password);
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        // console.log("hue hue ")
        // response=json.parse(response)
        if (response.ok) {
            const token = await response.json();
            // var payload = JSON.parse(window.atob(token.split('.')[1])); 
            // const decodedToken = jwt_decode(payload);
            console.log(token)
            localStorage.setItem('token', token);
            window.location.href = 'home';
        } else {
            alert('Invalid username or password');
        }
    });
}