const puppeteer = require('puppeteer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Function to check if the strategy exists in the database
async function checkStrategyInDatabase(strategyName) {
    return new Promise((resolve, reject) => {
        const dbPath = path.resolve(__dirname, '../../mydatabase.db'); // Use absolute path
        console.log('Database path:', dbPath); // Log the database path
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Database connection error:', err);
                reject(err);
            }
        });

        db.get("SELECT * FROM strategy_templates WHERE strategy_name = ?", [strategyName], (err, row) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            }
            db.close((err) => {
                if (err) {
                    console.error('Database close error:', err);
                    reject(err);
                }
            });
            resolve(row ? true : false);
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
    const strategyName = `Test Strategy ${Date.now()}`; // Use a unique strategy name with a timestamp
    const strategyDescription = 'This is a test strategy.';

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
        await page.waitForSelector('#user-firstname-display', { timeout: 10000 }); // Increase timeout
        console.log('Logged in and profile page is visible');

        // Navigate to the Create Strategy page
        await page.goto('http://localhost:3000/CreateStrategy.html');
        console.log('Navigated to Create Strategy page');

        // Fill out the Create Strategy form
        await page.type('#strategyName', strategyName);
        await page.select('#indicators', 'SMA'); // Select an indicator
        await page.click('#addIndicatorButton'); // Add the selected indicator
        await page.type('#description', strategyDescription);
        console.log('Filled out the Create Strategy form');

        // Submit the form
        await page.click('button[type="submit"]');
        console.log('Submitted the Create Strategy form');

        // Wait for a short delay to ensure the strategy is written to the database
        await delay(3000); // 3 seconds delay

        // Check the database for the new strategy
        const strategyExists = await checkStrategyInDatabase(strategyName);
        if (strategyExists) {
            console.log("Test Passed: Strategy created and verified in the database.");
        } else {
            console.log("Test Failed: Strategy not found in the database.");
        }
    } catch (error) {
        console.error("Test Failed:", error);
    } finally {
        await browser.close(); // Close the browser
    }
})();
