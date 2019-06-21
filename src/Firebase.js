// import * as firebase from "firebase";
// import firestore from "firebase/firestore";
import firebase from "firebase/app";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAwFJC8qvEpA95Es-Xgxg4LIDrof-jLxPg",
  authDomain: "notio-4fe72.firebaseapp.com",
  databaseURL: "https://notio-4fe72.firebaseio.com",
  projectId: "notio-4fe72",
  storageBucket: "",
  messagingSenderId: "309347555227",
  appId: "1:309347555227:web:75b6cb8c1a9be51b"
};
firebase.initializeApp(config);

var db = firebase.firestore();

export default db;
