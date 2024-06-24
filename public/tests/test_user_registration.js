const puppeteer = require('puppeteer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Function to check if the user exists in the database
async function checkUserInDatabase(email) {
    return new Promise((resolve, reject) => {
        const dbPath = path.resolve(__dirname, '../../mydatabase.db'); // Resolve the path to the database
        const db = new sqlite3.Database(dbPath); // Connect to the SQLite database

        // Query the database for a user with the given email
        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            if (err) {
                reject(err); // Reject the promise if there's an error
            }
            db.close(); // Close the database connection
            resolve(row ? true : false); // Resolve the promise with true if user exists, false otherwise
        });
    });
}

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Launch the browser
    const page = await browser.newPage(); // Open a new page

    const testEmail = 'Daniel.Plotnicov@example.com'; // Test email to be used for registration

    // Navigate to the registration page
    await page.goto('http://localhost:3000/LoginRegister.html'); // Use the actual path to LoginRegister.html
    console.log('Navigated to registration page');

    // Click on the signup tab
    await page.click('ul.tab-group li a[href="#signup"]');
    console.log('Clicked on signup tab');

    // Fill out the registration form
    await page.type('#signup-firstname', 'Daniel'); // Type in the first name
    await page.type('#signup-lastname', 'Plotnicov'); // Type in the last name
    await page.type('#signup-email', testEmail); // Type in the email
    await page.type('#signup-password', 'password123'); // Type in the password
    console.log('Filled out the registration form');

    // Submit the form
    await page.click('#submitSignUp'); // Click the submit button
    console.log('Submitted the registration form');

    // Wait for the profile page to become visible
    try {
        await page.waitForSelector('#logged-in:not(.hidden)', { timeout: 10000 }); // Wait for the profile page to appear
        console.log('Profile page is visible');

        // Check the database for the new user
        const userExists = await checkUserInDatabase(testEmail);
        if (userExists) {
            console.log("Test Passed: Registration successful and verified in the database.");
        } else {
            console.log("Test Failed: User not found in the database.");
        }
    } catch (error) {
        console.log("Test Failed: Profile page not loaded.");
        console.error(error);
    }

    await browser.close(); // Close the browser
})();
