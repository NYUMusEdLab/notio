// import * as firebase from "firebase";
// import firestore from "firebase/firestore";
import firebase from "firebase/app";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyDo5IoNGYLkSTD2sVrEGjgbAP8mBHDMeI8",
  authDomain: "notio-597ee.firebaseapp.com",
  projectId: "notio-597ee",
  storageBucket: "notio-597ee.appspot.com",
  messagingSenderId: "423817747829",
  appId: "1:423817747829:web:3d920cb6e603411792473c",
  measurementId: "G-4CQGRZ3HHS",
};
firebase.initializeApp(config);

var db = firebase.firestore();

export default db;
