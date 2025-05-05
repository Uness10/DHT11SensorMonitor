// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD3mMSi5WnXOL1jbsOcsh9kVqJencRZqGM",
    authDomain: "dhtmonitorapp.firebaseapp.com",
    databaseURL: "https://dhtmonitorapp-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "dhtmonitorapp",
    storageBucket: "dhtmonitorapp.firebasestorage.app",
    messagingSenderId: "917509912924",
    appId: "1:917509912924:web:39e4eb507db5d152a26999"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth, signInAnonymously };