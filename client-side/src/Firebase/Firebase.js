import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCHNs9IO58ldQ7PbaU9Fc68Bvtynrp128w",
  authDomain: "movie-app-a12bc.firebaseapp.com",
  projectId: "movie-app-a12bc",
  storageBucket: "movie-app-a12bc.appspot.com",
  messagingSenderId: "1048604049495",
  appId: "1:1048604049495:web:22cdcda55d96a7bac42312",
  measurementId: "G-DWZWS8ZFGW",
};

firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();
