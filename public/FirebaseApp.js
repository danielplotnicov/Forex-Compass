import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult} from "firebase/auth";

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("google-login-btn").addEventListener("click", function () {
        alert("Google login clicked");
    });

// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyCWUIVT8MuE8P1rHDaeRN4f8dvz_GkIzLA",
        authDomain: "forexapp-11117.firebaseapp.com",
        databaseURL: "https://forexapp-11117-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "forexapp-11117",
        storageBucket: "forexapp-11117.appspot.com",
        messagingSenderId: "527145992780",
        appId: "1:527145992780:web:f09ee618fe17876e63aae9",
        measurementId: "G-4TMW62ZLV0"
    };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

onAuthStateChanged(auth, (user) => {
    let notLoggedIn = document.getElementById('not-logged-in');
    let loggedIn = document.getElementById('logged-in');

    if (user) {
        let uid = user.uid;
        // User is signed in
        loggedIn.style.display = "none";
        notLoggedIn.style.display = "block";
    } else {
        // User is signed out
        loggedIn.style.display = "block";
        notLoggedIn.style.display = "none";
    }
});

// document.getElementById('signup-form').addEventListener('submit', signUp);
// document.getElementById('login-form').addEventListener('submit', logIn);
// document.getElementById('submitLogOut').addEventListener('click', logOut);

function signUp(event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up successfully
            const user = userCredential.user;
            console.log("User signed up:", user);
            document.getElementById('not-logged-in').style.display = 'none';
            document.getElementById('logged-in').style.display = 'block';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error signing up:", errorCode, errorMessage);
        });
}

function logIn(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Logged in successfully
            const user = userCredential.user;
            console.log("User logged in:", user);
            document.getElementById('not-logged-in').style.display = 'none';
            document.getElementById('logged-in').style.display = 'block';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error logging in:", errorCode, errorMessage);
        });
}

function logOut() {
    signOut(auth).then(() => {
        // Sign-out successful
        console.log("User logged out");
        document.getElementById('not-logged-in').style.display = 'block';
        document.getElementById('logged-in').style.display = 'none';
    }).catch((error) => {
        console.error("Error logging out:", error);
    });
}

const provider = new GoogleAuthProvider();
// Google Sign-In




signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        console.log("User signed in with Google:", user);
    }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.error("Error signing in with Google:", errorCode, errorMessage, email, credential);
});

});