const puppeteer = require('puppeteer');

// Function to introduce a delay
function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

(async () => {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage(); // Open a new page

    const testEmail = 'Daniel.Plotnicov@example.com'; // Test email for login
    const testPassword = 'password123'; // Test password for login

    // Navigate to the login page
    await page.goto('http://localhost:3000/LoginRegister.html');
    console.log('Navigated to login page');

    // Click on the login tab
    await page.click('ul.tab-group li a[href="#login"]');
    console.log('Clicked on login tab');

    // Fill out the login form
    await page.type('#login-email', testEmail); // Enter the test email
    await page.type('#login-password', testPassword); // Enter the test password
    console.log('Filled out the login form');

    // Submit the login form
    await page.click('#submitLogin');
    console.log('Submitted the login form');

    // Wait for the profile-specific element to appear
    try {
        // Wait for the profile page to load by checking for a specific element
        await page.waitForSelector('#user-firstname-display', { timeout: 5000 });
        console.log('Profile page is visible');

        // Check the data.isLoggedIn variable in the browser context
        const isLoggedIn = await page.evaluate(() => {
            return window.data && window.data.isLoggedIn; // Accessible from LoginRegister.js
        });
        await delay(3000); // 3 seconds delay
        // Log the test result based on the isLoggedIn variable
        if (isLoggedIn) {
            console.log("Test Passed: Login successful and data.isLoggedIn is true.");
        } else {
            console.log("Test Failed: data.isLoggedIn is false.");
        }
    } catch (error) {
        // Log the failure if the profile page does not load
        console.log("Test Failed: Profile page not loaded after login.");
        console.error(error);
    }

    await browser.close(); // Close the browser
})();
