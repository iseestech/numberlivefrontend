// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAZ8xYeLq9hU4vwKMxrCnLGdB19Zhj8JuE',
  authDomain: 'iseesaccountancy.firebaseapp.com',
  databaseURL: 'https://iseesaccountancy.firebaseio.com',
  projectId: 'iseesaccountancy',
  storageBucket: 'iseesaccountancy.appspot.com',
  messagingSenderId: '831259124270',
  appId: '1:831259124270:web:c7ecfb392339da86e575bf',
  measurementId: 'G-TQ9W55P7B0',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
