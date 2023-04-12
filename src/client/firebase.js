import firebase from 'firebase/compat/app'
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage'
const fbConfig = {
  apiKey: "AIzaSyDsKOAP64UiyWNmKfphD9EBt81_Z_MNNVc",
  authDomain: "learnenglishrss.firebaseapp.com",
  databaseURL: "https://learnenglishrss.firebaseio.com",
  projectId: "learnenglishrss",
  storageBucket: "learnenglishrss.appspot.com",
  messagingSenderId: "919325617505"
};
if (!firebase.apps.length) {
  firebase.initializeApp(fbConfig);
}
export const fb = firebase;
export const db = firebase.firestore();
export const auth = firebase.auth();
