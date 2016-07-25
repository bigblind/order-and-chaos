import firebase from "firebase";

export const user = new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            resolve(user);
        } else {
            firebase.auth().signInAnonymously();
        }
    });
}).then((user) => {
    console.log("userId: "+user.uid);
    return user;
});