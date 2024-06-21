const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Launch the browser
    const page = await browser.newPage(); // Open a new page

    const testEmail = 'john.doe@example.com';
    const testPassword = 'password123';

    // Navigate to the login page
    await page.goto('http://localhost:3000/LoginRegister.html'); // Use the actual path to LoginRegister.html

    // Click on the login tab
    await page.click('ul.tab-group li a[href="#login"]');

    // Fill out the login form
    await page.type('#login-email', testEmail);
    await page.type('#login-password', testPassword);

    // Submit the form
    await page.click('#submitLogin');

    // Wait for the profile-specific element to appear
    try {
        // Wait for the profile page to load
        await page.waitForSelector('#user-firstname-display', { timeout: 5000 });

        // Check the data.isLoggedIn variable in the browser context
        const isLoggedIn = await page.evaluate(() => {
            return window.data.isLoggedIn; // Ensure this is accessible and correctly set in your LoginRegister.js
        });

        if (isLoggedIn) {
            console.log("Test Passed: Login successful and data.isLoggedIn is true.");
        } else {
            console.log("Test Failed: data.isLoggedIn is false.");
        }
    } catch (error) {
        console.log("Test Failed: Profile page not loaded after login.");
    }

    await browser.close(); // Close the browser
})();
