// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyB7i8S_xsMMTIV4RoFO6IgXRXJPZi5CpWo",
    authDomain: "codeinsta-8cec1.firebaseapp.com",
    projectId: "codeinsta-8cec1",
    storageBucket: "codeinsta-8cec1.appspot.com",
    messagingSenderId: "261965618543",
    appId: "1:261965618543:web:a19bea389bc03dbaa7dc9a",
    measurementId: "G-JLEBMHENLG"
  };


  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  
  const auth = firebase.auth();

  var storageRef = firebase.storage().ref();

  
  export {db, auth,storageRef};