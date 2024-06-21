const puppeteer = require('puppeteer');
const sqlite3 = require('sqlite3').verbose();

// Function to check if the strategy exists in the database
async function checkStrategyInDatabase(strategyName) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('../../mydatabase.db'); // Update with your database path

        db.get("SELECT * FROM strategy_templates WHERE strategy_name = ?", [strategyName], (err, row) => {
            if (err) {
                reject(err);
            }
            db.close();
            resolve(row ? true : false);
        });
    });
}

// Function to introduce a delay
function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Launch the browser
    const page = await browser.newPage(); // Open a new page

    const testEmail = 'john.doe@example.com';
    const testPassword = 'password123';
    const strategyName = `Test Strategy ${Date.now()}`; // Use a unique strategy name with a timestamp
    const strategyDescription = 'This is a test strategy.';

    try {
        // Log in as a user
        await page.goto('http://localhost:3000/LoginRegister.html'); // Use the actual path to LoginRegister.html
        await page.click('ul.tab-group li a[href="#login"]');
        await page.type('#login-email', testEmail);
        await page.type('#login-password', testPassword);
        await page.click('#submitLogin');
        await page.waitForSelector('#user-firstname-display', { timeout: 10000 }); // Increase timeout

        // Navigate to the Create Strategy page
        await page.goto('http://localhost:3000/CreateStrategy.html'); // Use the actual path to CreateStrategy.html

        // Fill out the Create Strategy form
        await page.type('#strategyName', strategyName);
        await page.select('#indicators', 'SMA'); // Select an indicator (adjust as needed)
        await page.click('#addIndicatorButton'); // Add the selected indicator
        await page.type('#description', strategyDescription);

        // Submit the form
        await page.click('button[type="submit"]');

        // Wait for a short delay to ensure the strategy is written to the database
        await delay(5000); // 5 seconds delay

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
