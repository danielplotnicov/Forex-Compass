document.addEventListener('DOMContentLoaded', function() {
    updateVisibility(); // Check login status and update UI accordingly

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
            clearFields(); // Clear input fields when switching tabs
            // Activate the clicked tab and show corresponding content
            e.target.parentElement.classList.add('active');
            const activeContent = document.querySelector(e.target.getAttribute('href'));
            activeContent.classList.add('active');
            activeContent.style.display = 'block';
        }
    });

    // Function to clear all input fields
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
                updateVisibility(); // Update UI on logout
                clearFields(); // Clear input fields on logout
            });
    });

    // Function to handle signup form submission
    function submitSignupForm(e) {
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
            .then(data => {
                alert(data.message); // Alert the user with the response message
                if (data.id) { // Clear fields if registration is successful
                    clearFields();
                    // Automatically log in the user after registration
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
                                updateVisibility(); // Update UI on successful login
                                loadTemplates(); // Load templates after successful login
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
                    updateVisibility(); // Update UI on successful login
                    loadTemplates(); // Load templates after successful login
                } else {
                    alert(data.error); // Alert the user if login fails
                    clearFields(); // Optionally clear fields if login fails
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Function to update visibility based on login status
    function updateVisibility() {
        fetch('/check-login')
            .then(response => response.json())
            .then(data => {
                if (data.isLoggedIn) {
                    document.getElementById('logged-in').style.display = 'block';
                    document.getElementById('not-logged-in').style.display = 'none';

                    // Set user information in spans
                    document.getElementById('user-firstname-display').innerText = data.user.firstname;
                    document.getElementById('user-lastname-display').innerText = data.user.lastname;
                    document.getElementById('user-email-display').innerText = data.user.email;
                    document.getElementById('user-age-display').innerText = data.user.age;
                    document.getElementById('user-gender-display').innerText = data.user.gender;
                    document.getElementById('user-description-display').innerText = data.user.description;
                    document.getElementById('user-photo-display').innerText = data.user.photo;

                    loadTemplates(); // Load templates when the user is logged in
                } else {
                    document.getElementById('logged-in').style.display = 'none';
                    document.getElementById('not-logged-in').style.display = 'block';
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Function to load templates
    function loadTemplates() {
        fetch('/get-templates')
            .then(response => response.json())
            .then(data => {
                const templateList = document.getElementById('template-list');
                templateList.innerHTML = ''; // Clear previous entries
                data.templates.forEach(template => {
                    const ul = document.createElement('ul');
                    ul.textContent = `${template.strategy_name} - Created on: ${template.creation_date}`;

                    // Download button
                    const downloadButton = document.createElement('button');
                    downloadButton.textContent = 'Download';
                    downloadButton.className = 'downloadButton';
                    downloadButton.onclick = () => downloadTemplate(template.template_id);

                    // Delete button
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
                    alert(data.message); // Alert the user with the response message
                    loadTemplates(); // Reload templates after deletion
                } else {
                    alert('Error deleting template');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Expose the loadTemplates function to be callable from other scripts
    window.loadTemplates = loadTemplates;
});

// Function to switch to edit mode
function editUserDetails() {
    // Toggle display of input fields and static text
    const displayElements = document.querySelectorAll('#logged-in span');
    const inputFields = document.querySelectorAll('#logged-in input, #logged-in textarea');

    displayElements.forEach(element => element.style.display = 'none');
    inputFields.forEach(input => {
        input.style.display = 'inline'; // or 'block' depending on layout preference
        // Set input value to corresponding display text
        const id = input.id;
        const displayId = id + "-display";
        input.value = document.getElementById(displayId).textContent.trim();
    });

    // Hide 'Edit' button and show 'Save' button
    document.getElementById('edit-user-details').style.display = 'none';
    document.getElementById('save-user-details').style.display = 'inline'; // or 'block'
}

// Function to save edited details
function saveUserDetails() {
    const age = document.getElementById('user-age').value;
    const gender = document.getElementById('user-gender').value;
    const description = document.getElementById('user-description').value;
    const photo = document.getElementById('user-photo').value;
    const firstname = document.getElementById('user-firstname').value;
    const lastname = document.getElementById('user-lastname').value;
    const email = document.getElementById('user-email').value;

    // Send updated data to server
    fetch('/update-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ age, gender, description, photo, firstname, lastname, email })
    })
        .then(response => response.json())
        .then(data => {
            // alert(data.message);

            // Update displayed text
            document.getElementById('user-firstname-display').textContent = firstname;
            document.getElementById('user-lastname-display').textContent = lastname;
            document.getElementById('user-email-display').textContent = email;
            document.getElementById('user-age-display').textContent = age;
            document.getElementById('user-gender-display').textContent = gender;
            document.getElementById('user-description-display').textContent = description;
            document.getElementById('user-photo-display').textContent = photo;

            // Toggle visibility back to static view
            const displayElements = document.querySelectorAll('#logged-in span');
            const inputFields = document.querySelectorAll('#logged-in input, #logged-in textarea');
            displayElements.forEach(element => element.style.display = '');
            inputFields.forEach(input => input.style.display = 'none');

            // Hide 'Save' button and show 'Edit' button
            document.getElementById('save-user-details').style.display = 'none';
            document.getElementById('edit-user-details').style.display = '';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to save changes: ' + error.message);
        });
}
