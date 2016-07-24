import firebase from "firebase";

const config = {
    apiKey: "AIzaSyAagzjpOL-rbSliNu5LjPq-_GFC2qN5Zq4",
    authDomain: "order-and-chaos-55dbd.firebaseapp.com",
    databaseURL: "https://order-and-chaos-55dbd.firebaseio.com"
};

export default firebase.initializeApp(config);