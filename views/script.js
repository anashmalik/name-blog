let token = localStorage.getItem("token");
if (token == null) {
    window.location.href = 'login';
}
function clos() {
    document.getElementById('des').style.display = "none";
}
function handleClick(id) {
    window.location.href = `openblog?param1=${encodeURIComponent(id)}`
}
async function load() {
    const pp = document.getElementById('profilepic');
    const signout = document.getElementById('signout');
    pp.addEventListener('click', () => {
        document.getElementById('des').style.display = "block";
    })

    signout.addEventListener('click', (event) => {
        event.stopPropagation();
        const t = confirm("are you sure to sign out")
        if (t) {
            localStorage.removeItem('token');
            window.location.href = '/'
        }

    })
    let aau = await fetch('/author', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });
    aau = await aau.json();
    let pos = aau.pos;
    document.getElementById('pn').innerText += aau.name;
    let r_name = await fetch('/api/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pos })
    });
    r_name = await r_name.json();
    document.getElementById('pr').innerText += r_name[0].name;
    let array = await fetch('/api/permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pos })
    });
    if (array.ok) {
        let ans = await array.json();
        let per = document.getElementById('permissions');

        array = [];
        ans.forEach(element => {
            array.push(element.p_id);
        });
        const but = document.getElementById('des');
        if (array.includes(2)) {
            let add_user = document.createElement('button');
            add_user.classList.add('adbut');
            add_user.innerText = 'Add Blog';
            add_user.addEventListener('click', () => {
                document.getElementById('des').style.display = "none";
                window.location.href = 'add_blog';
            })
            but.appendChild(add_user);
            but.appendChild(document.createElement('br'));
        }
        if (array.includes(6)) {
            let add_user = document.createElement('button');
            add_user.classList.add('adbut');
            add_user.innerText = 'Add User';
            add_user.addEventListener('click', () => {
                document.getElementById('des').style.display = "none";
                window.location.href = 'add_user';
            })
            but.appendChild(add_user);
            but.appendChild(document.createElement('br'));
        }
        if (array.includes(7)) {
            let add_user = document.createElement('button');
            add_user.classList.add('adbut');
            add_user.innerText = 'All Users';
            add_user.addEventListener('click', () => {
                document.getElementById('des').style.display = "none";
                window.location.href = 'all_user';
            })
            but.appendChild(add_user);
            but.appendChild(document.createElement('br'));

        }
        if (array.includes(11)) {
            let add_user = document.createElement('button');
            add_user.classList.add('adbut');
            add_user.innerText = 'Add Role';
            add_user.addEventListener('click', () => {
                document.getElementById('des').style.display = "none";
                window.location.href = 'role';
            })
            but.appendChild(add_user);
            but.appendChild(document.createElement('br'));
        }
        if (array.includes(12)) {
            let add_user = document.createElement('button');
            add_user.classList.add('adbut');
            add_user.innerText = 'All Blogs';
            add_user.addEventListener('click', () => {
                document.getElementById('des').style.display = "none";
                window.location.href = 'allblog';
            })
            but.appendChild(add_user);
            but.appendChild(document.createElement('br'));

        }
        if (array.includes(13)) {
            let add_user = document.createElement('button');
            add_user.classList.add('adbut');
            add_user.innerText = 'My Blogs';
            add_user.addEventListener('click', () => {
                document.getElementById('des').style.display = "none";
                window.location.href = `myblog?param1=${encodeURIComponent(token)}`;
            })
            but.appendChild(add_user);
            but.appendChild(document.createElement('br'));
        }
        if (array.includes(14)) {
            let add_user = document.createElement('button');
            add_user.classList.add('adbut');
            add_user.innerText = 'All Deactivate Blog';
            add_user.addEventListener('click', () => {
                document.getElementById('des').style.display = "none";
                window.location.href = '/all_deactivate';
            })
            but.appendChild(add_user);
            but.appendChild(document.createElement('br'));
        }
        if (array.includes(15)) {
            let add_user = document.createElement('button');
            add_user.classList.add('adbut');
            add_user.innerText = 'My Deactivate Blogs';
            add_user.addEventListener('click', () => {
                document.getElementById('des').style.display = "none";
                window.location.href = `mydeactivate?param1=${encodeURIComponent(token)}`
            })
            but.appendChild(add_user);
            but.appendChild(document.createElement('br'));
        }
        if (array.includes(17)) {
            let add_user = document.createElement('button');
            add_user.classList.add('adbut');
            add_user.innerText = 'Add Category';
            add_user.addEventListener('click', () => {
                document.getElementById('des').style.display = "none";
                window.location.href = 'add_category';
            })
            but.appendChild(add_user);
            but.appendChild(document.createElement('br'));
        }
        if (array.includes(18)) {
          let add_user = document.createElement('button');
          add_user.classList.add('adbut');
          add_user.innerText = 'Delete Role';
          add_user.addEventListener('click', () => {
              document.getElementById('des').style.display = "none";
              window.location.href = 'delete_role';
          })
          but.appendChild(add_user);
          but.appendChild(document.createElement('br'));
      }
    }
}

load();




// ajes to serach blog




document.getElementById('searchButton').addEventListener('click', function() {
    const searchQuery = document.getElementById('searchQuery').value;
    console.log("clicked search");
    if (searchQuery=="" ) {
      window.location.href='/home'
      return;
    }
    if (searchQuery.length < 3 && searchQuery.length>0 ) {
        alert('Please enter at least 3 characters to search.');
        return;
      }
    fetch(`/searchBlogs?q=${searchQuery}`)
      .then(response => response.json())
      .then(data => {
        const blogResults = document.getElementById('blogResults');
        blogResults.innerHTML = '';
        if (data.length > 0) {
          data.forEach(blog => {
            const blogHTML = `
              <div class="container row post" onclick="handleClick('${blog.b_id}')">
                <div class="col-6 postimg">
                  <img src="${blog.imagePath}" alt="">
                </div>
                <div class="col-5">
                  <div class="postTitle">
                    <h3>${blog.title.slice(0, 40)}...</h3>
                  </div>
                  <p class="postdesc">${blog.desc.slice(0, 180)}...</p>
                  <div class="auth">
                    <p class="date d-md-block">upload: ${new Date(blog.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            `;
            blogResults.insertAdjacentHTML('beforeend', blogHTML);
          });
        } else {
          blogResults.innerHTML = '<p>No results found</p>';
        }
      })
      .catch(err => console.error(err));
  });


  function category(cat){
    if(cat=='/home'){
        window.location.href='/home'
    }
    else
    {fetch(`/searchcategory?q=${cat}`)
      .then(response => response.json())
      .then(data => {
        const blogResults = document.getElementById('blogResults');
        blogResults.innerHTML = '';
        if (data.length > 0) {
          data.forEach(blog => {
            const blogHTML = `
              <div class="container row post" onclick="handleClick('${blog.b_id}')">
                <div class="col-6 postimg">
                  <img src="${blog.imagePath}" alt="">
                </div>
                <div class="col-5">
                  <div class="postTitle">
                    <h3>${blog.title.slice(0, 40)}...</h3>
                  </div>
                  <p class="postdesc">${blog.desc.slice(0, 180)}...</p>
                  <div class="auth">
                    <p class="date d-md-block">upload: ${new Date(blog.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            `;
            blogResults.insertAdjacentHTML('beforeend', blogHTML);
          });
        } else {
          blogResults.innerHTML = '<p>No results found</p>';
        }
      })
      .catch(err => console.error(err));}
  }
  