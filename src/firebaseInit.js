import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  projectId: "e-ex-ddc18",
  appId: "1:1044496640519:web:5cea224430bee63f4d98a2",
  databaseURL:
    "https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "e-ex-ddc18.appspot.com",
  locationId: "europe-west",
  apiKey: "AIzaSyDDT4X8ksRdIkRZ6f5SlQoP_RrOYgE9Pkw",
  authDomain: "e-ex-ddc18.firebaseapp.com",
  messagingSenderId: "1044496640519",
};

const fbApp = initializeApp(firebaseConfig);
const fbStorage = getStorage(fbApp);

export { fbApp as firebaseApp, fbStorage, uploadBytes, ref, getDownloadURL };
