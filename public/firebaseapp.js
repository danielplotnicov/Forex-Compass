//firebaseapp.js
// Import the necessary methods
import { initializeApp, getAnalytics } from "firebase/app";
import {
    getAuth,
    connectAuthEmulator,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWUIVT8MuE8P1rHDaeRN4f8dvz_GkIzLA",
    authDomain: "forexapp-11117.firebaseapp.com",
    projectId: "forexapp-11117",
    storageBucket: "forexapp-11117.appspot.com",
    messagingSenderId: "527145992780",
    appId: "1:527145992780:web:f09ee618fe17876e63aae9",
    measurementId: "G-4TMW62ZLV0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get a reference to the auth service
const auth = getAuth(firebaseConfig);
connectAuthEmulator(auth, 'http://localhost:9099');

const loginEmailPassword = async () => {
    const loginEmail = emailInput.value;
    const loginPassword = passwordInput.value;

    const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    console.log(userCredential.user)
}

// Get a reference to the sign-in, sign-up and profile buttons
const signInButton = document.getElementById('signin-button');
const signUpButton = document.getElementById('signup-button');
const profileButton = document.getElementById('profile-button');

// Get a reference to the email and password input fields
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');