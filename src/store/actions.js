import axios from "axios";
import { nextTick } from "vue";
import config from "../../config.js";

export default {
  setUserData(
    { _, state },
    { firstName, lastName, userName, userId, authToken }
  ) {
    axios.put(
      `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/userDetails.json`,
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
  fetchFirstNameIfRegistered({ _, state }) {
    const userId = localStorage.getItem("userId");
    axios
      .get(
        `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/userDetails.json`
      )
      .then((res) => {
        const firstName = res.data.firstName || undefined || null;
        state.auth.userData.firstName = firstName;
        localStorage.setItem("firstName", firstName);
      });
  },
  changeUserName({ _, state }, { userId, userNameInput }) {
    axios
      .patch(
        `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/userDetails.json`,
        {
          userName: userNameInput,
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
        state.auth.userData.userId = res.data.localId
        localStorage.setItem("userId", res.data.localId);
        localStorage.setItem("idToken", res.data.idToken);
      })
      .catch((err) => {
        payload.isLoggedIn = false;
        payload.errorInfo = err.response.data.error.message
          ? err.response.data.error.message
          : err.response;
      });
    commit("signup", payload);
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
        localStorage.setItem("idToken", res.data.idToken);
      })
      .catch((err) => {
        payload.isLoggedIn = false;
        state.auth.errorInfo = err.response.data.error.message
        localStorage.clear();
        commit("signIn", payload.email);
      });
  },
  getUserData({ commit }, payload) {
    commit("getUserData", payload);
  },
  // THIS BELOW IS FOR TESTING PURPOSES
  sendRequest({ commit, state }, payload) {
    try {
      axios
        .post(
          `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${payload.userId}.json?auth=${payload.userId}`,
          { userId: payload.userId, giga: "chad" }
        )
        .catch((err) => (payload.errorInfo = err));

      commit("sendRequest", { userId: payload.userId });
    } catch (err) {
      state.auth.errorInfo = err.message;
    }
  },
  addProduct({ commit, state }, payload) {
    axios
      .post(
        `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${payload.userId}/addedProducts.json`,
        {
          prodName: payload.prodName,
          prodPrice: payload.prodPrice,
          prodTags: payload.prodTags,
          prodImgData: state.auth.userData.prodImgUrl,
        }
      )
      .catch((err) => ((state.auth.errorInfo = err), console.log(err)));
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
        if (res.status === 200) {
          commit("prodUploaded");
        }
      })
      .catch((err) => {
        return (state.auth.errorInfo = err.message);
      });
  },
  fetchProducts({ commit, state }, payload) {
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
  async removeProduct({ commit, state }, { prodId, userId, authToken }) {
    const res = await axios.delete(
      `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/addedProducts/${prodId}.json`
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
  logout({ commit }) {
    commit("logout");
  },
  clearLog({ commit }) {
    commit("clearLog");
  },
};
