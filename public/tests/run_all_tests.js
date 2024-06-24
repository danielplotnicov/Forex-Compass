const { exec } = require('child_process');
const path = require('path');

// Helper function to run a test script
function runTest(scriptPath) {
    return new Promise((resolve, reject) => {
        exec(`node ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running ${scriptPath}:`, stderr);
                reject(stderr);
            } else {
                console.log(`Output of ${scriptPath}:`, stdout);
                resolve(stdout);
            }
        });
    });
}

(async () => {
    try {
        console.log('Running test_user_registration.js...');
        await runTest(path.join(__dirname, 'test_user_registration.js'));

        console.log('Running test_user_login.js...');
        await runTest(path.join(__dirname, 'test_user_login.js'));

        console.log('Running test_profile_management.js...');
        await runTest(path.join(__dirname, 'test_profile_management.js'));

        console.log('Running test_create_strategy.js...');
        await runTest(path.join(__dirname, 'test_create_strategy.js'));

        console.log('All tests completed successfully!');
    } catch (error) {
        console.error('One or more tests failed:', error);
    }
})();
