import * as firebase from 'firebase';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyB7p_2wktCwuE8pBatdEnrN0LBGTA2OPuo",
    authDomain: "gdgnewdelhi-3-again.firebaseapp.com",
    databaseURL: "https://gdgnewdelhi-3-again.firebaseio.com",
    projectId: "gdgnewdelhi-3-again",
    storageBucket: "gdgnewdelhi-3-again.appspot.com",
    messagingSenderId: "164943665678"
}
const app = firebase.initializeApp(firebaseConfig);

const dbRef = app.database();
const ModelRef = dbRef.ref('model');
export {
    ModelRef,
}