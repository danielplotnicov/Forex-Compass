const puppeteer = require('puppeteer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Function to check the updated profile details in the database
async function checkProfileInDatabase(email) {
    return new Promise((resolve, reject) => {
        const dbPath = path.resolve(__dirname, '../../mydatabase.db'); // Update with your correct database path
        const db = new sqlite3.Database(dbPath); // Use absolute path

        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            if (err) {
                reject(err);
            }
            db.close();
            resolve(row);
        });
    });
}

// Function to introduce a delay
function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Launch the browser
    const page = await browser.newPage(); // Open a new page

    const testEmail = 'Daniel.Plotnicov@example.com';
    const testPassword = 'password123';

    const updatedDetails = {
        firstname: 'Daniel',
        lastname: 'Plotnicov',
        email: 'Daniel.Plotnicov@example.com',
        age: 21,
        gender: 'Male',
        description: 'Updated profile description.',
        photo: 'http://example.com/photo.jpg'
    };

    try {
        // Log in as a user
        await page.goto('http://localhost:3000/LoginRegister.html'); // Use the actual path to LoginRegister.html
        console.log('Navigated to login/register page');
        await page.click('ul.tab-group li a[href="#login"]');
        console.log('Clicked on login tab');
        await page.type('#login-email', testEmail);
        await page.type('#login-password', testPassword);
        console.log('Entered login credentials');
        await page.click('#submitLogin');
        console.log('Submitted login form');
        await page.waitForSelector('#logged-in:not(.hidden)', { timeout: 10000 }); // Wait for the logged-in section to appear
        console.log('Profile page is visible after login');

        // Ensure the logged-in section is visible
        const loggedInVisible = await page.evaluate(() => {
            return window.getComputedStyle(document.getElementById('logged-in')).display !== 'none';
        });

        if (!loggedInVisible) {
            throw new Error('Failed to log in and display the logged-in section.');
        }

        // Fill out the profile update form
        await page.click('#edit-user-details'); // Click on the edit button
        console.log('Clicked on edit profile button');

        await page.evaluate((details) => {
            document.getElementById('user-firstname').value = details.firstname;
            document.getElementById('user-lastname').value = details.lastname;
            document.getElementById('user-email').value = details.email;
            document.getElementById('user-age').value = details.age;
            document.getElementById('user-gender').value = details.gender;
            document.getElementById('user-description').value = details.description;
            document.getElementById('user-photo').value = details.photo;
        }, updatedDetails);
        console.log('Filled out profile update form');

        // Submit the form
        await page.click('#save-user-details');
        console.log('Submitted profile update form');

        // Wait for a short delay to ensure the profile is updated in the database
        await delay(5000);

        // Check the database for the updated profile
        const updatedProfile = await checkProfileInDatabase(updatedDetails.email);

        console.log('Updated Profile from Database:', updatedProfile);
        console.log('Expected Updated Details:', updatedDetails);

        if (updatedProfile &&
            updatedProfile.firstname === updatedDetails.firstname &&
            updatedProfile.lastname === updatedDetails.lastname &&
            updatedProfile.email === updatedDetails.email &&
            updatedProfile.age === updatedDetails.age &&
            updatedProfile.gender === updatedDetails.gender &&
            updatedProfile.description === updatedDetails.description &&
            updatedProfile.photo === updatedDetails.photo) {
            console.log("Test Passed: Profile updated and verified in the database.");
        } else {
            console.log("Test Failed: Profile update not verified in the database.");
            console.log("Database value mismatch:");
            console.log(`Firstname: expected ${updatedDetails.firstname}, got ${updatedProfile.firstname}`);
            console.log(`Lastname: expected ${updatedDetails.lastname}, got ${updatedProfile.lastname}`);
            console.log(`Email: expected ${updatedDetails.email}, got ${updatedProfile.email}`);
            console.log(`Age: expected ${updatedDetails.age}, got ${updatedProfile.age}`);
            console.log(`Gender: expected ${updatedDetails.gender}, got ${updatedProfile.gender}`);
            console.log(`Description: expected ${updatedDetails.description}, got ${updatedProfile.description}`);
            console.log(`Photo: expected ${updatedDetails.photo}, got ${updatedProfile.photo}`);
        }
    } catch (error) {
        console.error("Test Failed:", error);
    } finally {
        await browser.close(); // Close the browser
    }
})();
