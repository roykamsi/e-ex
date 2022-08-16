import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  "projectId": "e-ex-ddc18",
  "appId": "1:1044496640519:web:5cea224430bee63f4d98a2",
  "databaseURL": "https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app",
  "storageBucket": "e-ex-ddc18.appspot.com",
  "locationId": "europe-west",
  "apiKey": "AIzaSyDDT4X8ksRdIkRZ6f5SlQoP_RrOYgE9Pkw",
  "authDomain": "e-ex-ddc18.firebaseapp.com",
  "messagingSenderId": "1044496640519"
};

const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp);
const storageRef = ref(storage)

export { firebaseApp, storage, storageRef };
