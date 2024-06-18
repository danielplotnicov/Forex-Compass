import { initializeApp } from "firebase/app";

document.addEventListener('DOMContentLoaded', (event) => {

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

});