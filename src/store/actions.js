import axios from "axios";
import { nextTick } from "vue";
import config from "../../config.js";
import { fbStorage, uploadBytes, ref, getDownloadURL } from "@/firebaseInit.js";

export default {
  setUserData(
    { _, state },
    { firstName, lastName, userName, userId, authToken }
  ) {
    axios.put(
      `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/userDetails.json?auth=${
        state.auth.userData.authToken || localStorage.getItem("idToken")
      }`,
      {
        firstName,
        lastName,
        userName,
      }
    );
    localStorage.setItem("userName", userName);
    state.auth.userData.firstName = firstName;
    state.auth.userData.lastName = lastName;
    state.auth.userData.userName = userName;
  },
  async fetchFirstNameIfRegistered({ _, state }) {
    const userId = localStorage.getItem("userId");
    await axios
      .get(
        `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/userDetails.json`
      )
      .then((res) => {
        if (res.data != null) {
          const firstName = res.data.firstName;
          localStorage.setItem("firstName", firstName);
          const userName = res.data.userName;
          localStorage.setItem("userName", userName);
          state.auth.userData.userName = userName;
        } else return;
      });
  },
  changeUserName({ _, state }, { userId, userNameInput }) {
    localStorage.setItem("userName", userNameInput);
    state.auth.userData.userName = userNameInput;
    axios
      .patch(
        `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/userDetails.json?auth=${
          state.auth.userData.authToken || localStorage.getItem("idToken")
        }`,
        {
          userName: userNameInput,
        }
      )
      .catch((err) => (state.auth.errorInfo = err));
  },
  changeFirstName({ _, state }, { userId, userNameInput }) {
    localStorage.setItem("firstName", userNameInput);
    state.auth.userData.firstName = userNameInput;
    axios
      .patch(
        `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/userDetails.json?auth=${
          state.auth.userData.authToken || localStorage.getItem("idToken")
        }`,
        {
          firstName: userNameInput,
        }
      )
      .catch((err) => (state.auth.errorInfo = err));
  },
  loadProducts({ commit, state }, { userId }) {
    const productsEndPoint = `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/products.json`;
    const userProdsEndPoint = `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users.json`;
    const userNameReqEndPoint = `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users.json`;
    const productsReq = axios.get(productsEndPoint);
    const userProdsReq = axios.get(userProdsEndPoint);
    const userNameReq = axios.get(userNameReqEndPoint);
    axios
      .all([productsReq, userProdsReq, userNameReq])
      .then(
        axios.spread((...res) => {
          const reqProds = Object.entries(res[0].data)[0][1];
          const eachUser = Object.entries(res[1].data);
          const eachUserName = Object.entries(res[2].data);
          let userProducts = [];
          eachUser.forEach((user, idx) => {
            const userDetails = eachUserName[idx][1];
            const userName =
              userDetails.userDetails !== undefined
                ? userDetails.userDetails.userName
                : null || undefined;
            const [userId, addedProducts] = user;
            const userProds = Object.entries(addedProducts.addedProducts);
            userProds.forEach((prod, idx) => {
              const product = {
                id: prod[0],
                name: prod[1].prodName,
                price: prod[1].prodPrice,
                category: prod[1].prodTags,
                image: prod[1].prodImgData || "No image",
                userName,
                userId,
              };
              userProducts.push(product);
            });
            commit("addProductsToLocal", { reqProds, userProducts });
            commit("filterCategories");
          });
        })
      )
      .catch((errors) => {
        console.log(errors);
        state.auth.errorInfo = errors.message;
      });
  },
  setFilters({ _1, state }, payload) {
    state.filters.fName = payload.fName;
    state.filters.fPrice = payload.fPrice;
    state.filters.fCheckbox = payload.fCheckbox;
  },
  loadFilteredProducts({ commit }) {
    commit("loadFilteredProducts");
  },
  async signup({ commit, state }, payload) {
    await axios
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${config.API_KEY}`,
        {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }
      )
      .then((res) => {
        this.clearLog;
        payload.isLoggedIn = true;
        state.auth.userData.userId = res.data.localId;
        localStorage.setItem("userId", res.data.localId);
        state.auth.userData.authToken = res.data.idToken;
        localStorage.setItem("idToken", res.data.idToken);
      })
      .catch((err) => {
        payload.isLoggedIn = false;
        payload.errorInfo = err.response.data.error.message
          ? err.response.data.error.message
          : err.response;
      });
    commit("signup", payload);
    commit("autoLogout");
  },
  async signIn({ commit, state }, payload) {
    await axios
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.API_KEY}`,
        {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }
      )
      .then((res) => {
        this.clearLog;
        state.auth.isLoggedIn = true;
        localStorage.setItem("userId", res.data.localId);
        state.auth.userData.authToken = res.data.idToken;
        localStorage.setItem("idToken", res.data.idToken);
        commit("autoLogout");
      })
      .catch((err) => {
        payload.isLoggedIn = false;
        state.auth.errorInfo = err.response.data.error.message;
        localStorage.clear();
        commit("signIn", payload.email);
      });
  },
  getUserData({ commit }, payload) {
    commit("getUserData", payload);
  },
  // THIS BELOW IS FOR TESTING PURPOSES 🧪
  sendRequest({ commit, state }, payload) {
    try {
      axios
        .post(
          `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${
            payload.userId
          }.json?auth=${payload.userId}?auth=${
            state.auth.userData.authToken || localStorage.getItem("idToken")
          }`,
          { userId: payload.userId, giga: "chad" }
        )
        .catch((err) => (payload.errorInfo = err));

      commit("sendRequest", { userId: payload.userId });
    } catch (err) {
      state.auth.errorInfo = err.message;
    }
  },
  async selectedProduct({ _, state }, { selectedProdId, userId }) {
    state.auth.userData.selectedProduct = selectedProdId;
    const authToken =
      state.auth.userData.authToken || localStorage.getItem("idToken");
    const res = await axios.get(
      `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/addedProducts/${selectedProdId}.json?auth=${authToken}`
    );
    state.auth.userData.selectedProduct = res.data;
  },
  async patchEditedProduct(
    { _, state },
    { userId, selectedProdId, editedProdName, editedProdPrice, editedProdTags }
  ) {
    if (state.auth.userData.selectedProduct) {
      const authToken =
        state.auth.userData.authToken || localStorage.getItem("idToken");
      await axios.patch(
        `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/addedProducts/${selectedProdId}.json?auth=${authToken}`,
        {
          prodName: editedProdName,
          prodPrice: editedProdPrice,
          prodTags: editedProdTags,
        }
      );
      const res = await axios.get(
        `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/addedProducts/${selectedProdId}.json?auth=${authToken}`
      );
      console.log(res.data);
    }
  },
  async uploadImage({ _, state }, { imageName, imageData }) {
    // IMAGE UPLOADING IS COMMITTED IN THE **UserPage.Vue**
    const getRef = ref(fbStorage, imageName);

    await uploadBytes(getRef, imageData);
    await getDownloadURL(getRef)
      .then((url) => {
        state.auth.userData.prodImgUrl = url;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  async addProduct({ commit, state }, payload) {
    if (state.auth.userData.prodImgUrl) {
      await axios
        .post(
          `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${
            payload.userId
          }/addedProducts.json?auth=${
            state.auth.userData.authToken || localStorage.getItem("idToken")
          }`,
          {
            prodName: payload.prodName,
            prodPrice: payload.prodPrice,
            prodTags: payload.prodTags,
            prodImgData: state.auth.userData.prodImgUrl,
          }
        )
        .catch((err) => ((state.auth.errorInfo = err), console.log(err)));
      commit("prodUploaded");
    }
  },
  // THIS BELOW LOOKS THE SAME, BUT GETS PRODUCTS LOCALLY
  addAndUpdateUserProducts({ commit, state }, payload) {
    axios
      .get(
        `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users.json`
      )
      .then((res) => {
        const userId = payload.userId;
        const resData = Object.entries(res.data);
        for (const data of resData) {
          if (data[0] === userId) {
            const eachProduct = Object.entries(data[1].addedProducts);
            let products = [];
            eachProduct.forEach((prod) => {
              const product = {
                id: prod[0],
                name: prod[1].prodName,
                price: prod[1].prodPrice,
                category: prod[1].prodTags,
                image: prod[1].prodImgData || "No image",
                userId,
              };
              products.push(product);
            });
            commit("updateProducts", products);
          }
        }
      })
      .catch((err) => {
        return (state.auth.errorInfo = err.message);
      });
  },
  async fetchUserProducts({ commit, state }, payload) {
    const userId = localStorage.getItem("userId");
    await axios
      .get(
        `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users.json`
      )
      .then((res) => {
        const resData = Object.entries(res.data);
        for (const data of resData) {
          if (data[0] === userId) {
            const eachProduct = Object.entries(data[1].addedProducts);
            let products = [];
            eachProduct.forEach((prod) => {
              const product = {
                id: prod[0],
                name: prod[1].prodName,
                price: prod[1].prodPrice,
                category: prod[1].prodTags || ["computer"],
                image: prod[1].prodImgData || "No image",
                userId,
                deletable: false,
              };
              products.push(product);
            });
            state.auth.userData.addedProducts = products;
          }
        }
      })
      .catch((err) => {
        return (state.auth.errorInfo = err.message);
      });
  },
  async removeProduct({ commit, state }, { prodId, userId }) {
    const authToken =
      state.auth.userData.authToken || localStorage.getItem("idToken");
    const res = await axios.delete(
      `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/addedProducts/${prodId}.json?auth=${authToken}`
    );
    await axios.patch(
      `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json?auth=${authToken}`,
      { addedProducts: "" }
    );
    const deletedProd = state.auth.userData.addedProducts.find(
      (el) => el.id === prodId
    );
    const prodIdx = state.auth.userData.addedProducts.findIndex(
      (el) => el.id === prodId
    );
    state.auth.userData.addedProducts.splice(prodIdx, 1);
    // const addHistory = await axios.post(`https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/deletedProducts/${prodId}.json?auth=${authToken}`) // Maybe another time
  },
  // MESSAGING SYSTEM
  async sendMessageToUser(
    { _, state },
    { prodId: selectedProdId, senderName, senderEmail, senderMessage }
  ) {
    const userId = localStorage.getItem("userId");
    const authToken =
      state.auth.userData.authToken || localStorage.getItem("idToken");
    let selectedUserId;
    state.products.forEach((el) => {
      if (el.id === selectedProdId) {
        selectedUserId = el.userId;
      }
    });
    const axiosGet = await axios.post(
      `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${selectedUserId}/receivedMessages.json?auth=${authToken}`,
      {
        senderName: senderName || userId,
        senderEmail,
        senderMessage,
        selectedProdId,
      }
    );
    state.messaging.isMessageSended = true
  },
  async fetchUserIncomingMessages({_, state}, {userId}) {
    const authToken =
      state.auth.userData.authToken || localStorage.getItem("idToken");

    const axiosGet = await axios.get(
      `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/receivedMessages.json?auth=${authToken}`)

      state.messaging.receivedMessages = axiosGet.data
      
  },
  // END OF MESSAGING SYSTEM
  logout({ commit }) {
    commit("logout");
  },
  clearLog({ commit }) {
    commit("clearLog");
  },
};
