const firebaseConfig = {
    apiKey: "AIzaSyAfS9qjdI-zZ5a8z9IlfuA83ilukZrDcFY",
    authDomain: "nhi06-c8375.firebaseapp.com",
    projectId: "nhi06-c8375",
    storageBucket: "nhi06-c8375.appspot.com",
    messagingSenderId: "620088727553",
    appId: "1:620088727553:web:36d5768da11677bf338800"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();