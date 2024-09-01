import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC-ZcvW7ALVr1b-0Fn0kYTiUAsLLCqi718",
  authDomain: "e-commer-app-20184.firebaseapp.com",
  projectId: "e-commer-app-20184",
  storageBucket: "e-commer-app-20184.appspot.com",
  messagingSenderId: "268932226220",
  appId: "1:268932226220:web:a9d340209bc752d61e9309",
  measurementId: "G-TK6Z3H7TDE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);