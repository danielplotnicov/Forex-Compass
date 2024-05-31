document.addEventListener('DOMContentLoaded', function() {
    updateVisibility();

    const tabGroup = document.querySelector('.tab-group');
    const tabs = tabGroup.querySelectorAll('li');
    const contents = document.querySelectorAll('.tab-content > div');

    tabGroup.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            tabs.forEach(tab => tab.classList.remove('active'));
            contents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            e.target.parentElement.classList.add('active');
            const activeContent = document.querySelector(e.target.getAttribute('href'));
            activeContent.classList.add('active');
            activeContent.style.display = 'block';
        }
    });

    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const firstname = document.getElementById('signup-firstname').value;
        const lastname = document.getElementById('signup-lastname').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname, lastname, email, password })
        })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error:', error));
    });

    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    // Handle login logic, perhaps storing JWT or session data
                } else {
                    alert(data.error);
                }
            })
            .catch(error => console.error('Error:', error));
    });

    // Check login status on page load


    function updateVisibility() {
        fetch('/check-login').then(response => response.json()).then(data => {
            if (data.isLoggedIn) {
                document.getElementById('logged-in').style.display = 'block';
                document.getElementById('not-logged-in').style.display = 'none';
            } else {
                document.getElementById('logged-in').style.display = 'none';
                document.getElementById('not-logged-in').style.display = 'block';
            }
        });
    }

    document.getElementById('submitLogin').addEventListener('click', function() {
        // Assuming you collect login data here
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: 'user', password: 'pass' })
        })
            .then(response => response.json())
            .then(data => {
                updateVisibility();
            });
    });

    document.getElementById('submitLogOut').addEventListener('click', function() {
        fetch('/logout', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                updateVisibility();
            });
    });


});

function updateUserDetails() {
    const age = document.getElementById('user-age').value;
    const gender = document.getElementById('user-gender').value;
    const description = document.getElementById('user-description').value;
    const photo = document.getElementById('user-photo').value;

    fetch('/update-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ age, gender, description, photo })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // Reload or update page content as needed
        })
        .catch(error => console.error('Error:', error));
}
