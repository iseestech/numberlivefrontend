// import firebase from 'firebase/app';
// import 'firebase/messaging';

// const firebaseConfig = {
//     apiKey: "AIzaSyAZ8xYeLq9hU4vwKMxrCnLGdB19Zhj8JuE",
//     authDomain: "iseesaccountancy.firebaseapp.com",
//     databaseURL: "https://iseesaccountancy.firebaseio.com",
//     projectId: "iseesaccountancy",
//     storageBucket: "iseesaccountancy.appspot.com",
//     messagingSenderId: "831259124270",
//     appId: "1:831259124270:web:c7ecfb392339da86e575bf",
//     measurementId: "G-TQ9W55P7B0"
//   };

// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// export const getToken = (setTokenFound) => {
//   return messaging.getToken({vapidKey: 'BLdGwwqEFHCzoWvLu3vc2R1mbf35PCAovdUegoJPJyUcGuh56m0hju6AkP2L9i_OG_LnFo_6SJUsk8CmsS8cbPM'}).then((currentToken) => {
//     if (currentToken) {
//       console.log('current token for client: ', currentToken);
//       setTokenFound(true);
//       // Track the token -> client mapping, by sending to backend server
//       // show on the UI that permission is secured
//     } else {
//       console.log('No registration token available. Request permission to generate one.');
//       setTokenFound(false);
//       // shows on the UI that permission is required
//     }
//   }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     // catch error while creating client token
//   });
// }

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     messaging.onMessage((payload) => {
//       resolve(payload);
//     });
// });
