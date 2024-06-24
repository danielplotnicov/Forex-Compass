document.addEventListener('DOMContentLoaded', function() {
    // Initial UI update based on login status
    updateVisibility();

    // Reference to the tab group and its individual tabs
    const tabGroup = document.querySelector('.tab-group');
    const tabs = tabGroup.querySelectorAll('li');
    const contents = document.querySelectorAll('.tab-content > div');

    // Event listener for tab switching
    tabGroup.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            // Deactivate all tabs and hide all contents
            tabs.forEach(tab => tab.classList.remove('active'));
            contents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            // Clear input fields when switching tabs
            clearFields();
            // Activate the clicked tab and show corresponding content
            e.target.parentElement.classList.add('active');
            const activeContent = document.querySelector(e.target.getAttribute('href'));
            activeContent.classList.add('active');
            activeContent.style.display = 'block';

            // Fetch user profile if the profile tab is activated
            if (e.target.getAttribute('href') === '#profile') {
                fetchUserProfile(window.data.user.email);
            }
        }
    });

    // Function to clear all input fields in the forms
    function clearFields() {
        document.getElementById('signup-firstname').value = '';
        document.getElementById('signup-lastname').value = '';
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-password').value = '';
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
    }

    // Event listeners for form submissions
    document.getElementById('signup-form').addEventListener('submit', submitSignupForm);
    document.getElementById('login-form').addEventListener('submit', submitLoginForm);

    // Event listener for logout button
    document.getElementById('submitLogOut').addEventListener('click', function() {
        fetch('/logout', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                // Update UI and clear fields after logging out
                updateVisibility();
                clearFields();
            });
    });

    // Function to handle signup form submission
    function submitSignupForm(e) {
        e.preventDefault();
        const firstname = document.getElementById('signup-firstname').value;
        const lastname = document.getElementById('signup-lastname').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        // Register new user
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname, lastname, email, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.id) {
                    clearFields();
                    // Automatically log in the user after successful registration
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
                                updateVisibility();
                                loadTemplates();
                            } else {
                                alert('Automatic login failed. Please log in manually.');
                            }
                        })
                        .catch(error => console.error('Error during automatic login:', error));
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Function to handle login form submission
    function submitLoginForm(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Log in the user
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
                    updateVisibility();
                    loadTemplates();
                } else {
                    alert(data.error);
                    clearFields();
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Function to update UI visibility based on login status
    function updateVisibility() {
        fetch('/check-login')
            .then(response => response.json())
            .then(data => {
                window.data = data; // Make the data object globally accessible

                if (data.isLoggedIn) {
                    document.getElementById('logged-in').classList.remove('hidden');
                    document.getElementById('not-logged-in').classList.add('hidden');

                    // Display user information
                    document.getElementById('user-firstname-display').innerText = data.user.firstname;
                    document.getElementById('user-lastname-display').innerText = data.user.lastname;
                    document.getElementById('user-email-display').innerText = data.user.email;
                    document.getElementById('user-age-display').innerText = data.user.age;
                    document.getElementById('user-gender-display').innerText = data.user.gender;
                    document.getElementById('user-description-display').innerText = data.user.description;
                    document.getElementById('user-photo-display').innerText = data.user.photo;

                    // Load user templates
                    loadTemplates();
                } else {
                    document.getElementById('logged-in').classList.add('hidden');
                    document.getElementById('not-logged-in').classList.remove('hidden');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Function to fetch user profile information
    function fetchUserProfile(email) {
        fetch(`/user/${email}`)
            .then(response => response.json())
            .then(data => {
                // Update profile fields with fetched data
                document.getElementById('user-firstname-display').innerText = data.firstname;
                document.getElementById('user-lastname-display').innerText = data.lastname;
                document.getElementById('user-email-display').innerText = data.email;
                document.getElementById('user-age-display').innerText = data.age;
                document.getElementById('user-gender-display').innerText = data.gender;
                document.getElementById('user-description-display').innerText = data.description;
                document.getElementById('user-photo-display').innerText = data.photo;
            })
            .catch(error => console.error('Error fetching user profile:', error));
    }

    // Function to load user templates
    function loadTemplates() {
        fetch('/get-templates')
            .then(response => response.json())
            .then(data => {
                const templateList = document.getElementById('template-list');
                templateList.innerHTML = '';
                // Populate the template list with fetched data
                data.templates.forEach(template => {
                    const ul = document.createElement('ul');
                    ul.textContent = `${template.strategy_name} - Created on: ${template.creation_date}`;

                    const downloadButton = document.createElement('button');
                    downloadButton.textContent = 'Download';
                    downloadButton.className = 'downloadButton';
                    downloadButton.onclick = () => downloadTemplate(template.template_id);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'deleteButton';
                    deleteButton.onclick = () => deleteTemplate(template.template_id);

                    ul.appendChild(downloadButton);
                    ul.appendChild(deleteButton);
                    templateList.appendChild(ul);
                });
            });
    }

    // Function to download a template
    function downloadTemplate(templateId) {
        fetch(`/download-template/${templateId}`)
            .then(response => response.json())
            .then(data => {
                const blob = new Blob([data.templateContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${data.strategyName}.tpl`;
                a.click();
                URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error:', error));
    }

    // Function to delete a template
    function deleteTemplate(templateId) {
        fetch(`/delete-template/${templateId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    loadTemplates();
                } else {
                    alert('Error deleting template');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Make the loadTemplates function globally accessible
    window.loadTemplates = loadTemplates;
});

// Function to enable editing of user details
function editUserDetails() {
    const displayElements = document.querySelectorAll('#logged-in span');
    const inputFields = document.querySelectorAll('#logged-in input, #logged-in textarea');

    // Hide display elements and show input fields with current values
    displayElements.forEach(element => element.style.display = 'none');
    inputFields.forEach(input => {
        input.style.display = 'inline';
        const id = input.id;
        const displayId = id + "-display";
        input.value = document.getElementById(displayId).textContent.trim();
    });

    // Toggle visibility of edit and save buttons
    document.getElementById('edit-user-details').style.display = 'none';
    document.getElementById('save-user-details').style.display = 'inline';
}

// Function to save edited user details
function saveUserDetails() {
    const age = document.getElementById('user-age').value;
    const gender = document.getElementById('user-gender').value;
    const description = document.getElementById('user-description').value;
    const photo = document.getElementById('user-photo').value;
    const firstname = document.getElementById('user-firstname').value;
    const lastname = document.getElementById('user-lastname').value;
    const email = document.getElementById('user-email').value;

    // Update user details on the server
    fetch('/update-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ age, gender, description, photo, firstname, lastname, email })
    })
        .then(response => response.json())
        .then(data => {
            // Update displayed values with saved data
            document.getElementById('user-firstname-display').textContent = firstname;
            document.getElementById('user-lastname-display').textContent = lastname;
            document.getElementById('user-email-display').textContent = email;
            document.getElementById('user-age-display').textContent = age;
            document.getElementById('user-gender-display').textContent = gender;
            document.getElementById('user-description-display').textContent = description;
            document.getElementById('user-photo-display').textContent = photo;

            const displayElements = document.querySelectorAll('#logged-in span');
            const inputFields = document.querySelectorAll('#logged-in input, #logged-in textarea');
            displayElements.forEach(element => element.style.display = '');
            inputFields.forEach(input => input.style.display = 'none');

            document.getElementById('save-user-details').style.display = 'none';
            document.getElementById('edit-user-details').style.display = '';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to save changes: ' + error.message);
        });
}
