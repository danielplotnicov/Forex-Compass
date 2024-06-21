const puppeteer = require('puppeteer');
const sqlite3 = require('sqlite3').verbose();

// Function to check if the user exists in the database
async function checkUserInDatabase(email) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('../../mydatabase.db'); // Update with your database path

        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            if (err) {
                reject(err);
            }
            db.close();
            resolve(row ? true : false);
        });
    });
}

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Launch the browser
    const page = await browser.newPage(); // Open a new page

    const testEmail = 'john.doe@example.com';

    // Navigate to the registration page
    await page.goto('http://localhost:3000/LoginRegister.html'); // Use the actual path to LoginRegister.html

    // Click on the signup tab
    await page.click('ul.tab-group li a[href="#signup"]');

    // Fill out the registration form
    await page.type('#signup-firstname', 'John');
    await page.type('#signup-lastname', 'Doe');
    await page.type('#signup-email', testEmail);
    await page.type('#signup-password', 'password123');

    // Submit the form
    await page.click('#submitSignUp');

    // Wait for a profile-specific element to appear
    try {
        // Adjust the selector to match an element unique to the profile page
        await page.waitForSelector('#user-firstname-display', { timeout: 5000 });

        // Check the database for the new user
        const userExists = await checkUserInDatabase(testEmail);
        if (userExists) {
            console.log("Test Passed: Registration successful and verified in the database.");
        } else {
            console.log("Test Failed: User not found in the database.");
        }
    } catch (error) {
        console.log("Test Failed: Profile page not loaded.");
    }

    await browser.close(); // Close the browser
})();
