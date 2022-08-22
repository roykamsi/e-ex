import axios from "axios";
import { nextTick } from "vue";
import config from "../../config.js";

export default {
  loadProducts({ commit, state }) {
    const productsEndPoint =
      "https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/products.json";
    const userProdsEndPoint =
      "https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users.json";
    const productsReq = axios.get(productsEndPoint);
    const userProdsReq = axios.get(userProdsEndPoint);
    axios
      .all([productsReq, userProdsReq])
      .then(
        axios.spread((...res) => {
          const reqProds = Object.entries(res[0].data)[0][1];
          const eachUser = Object.entries(res[1].data);
          // Now let's transform EACH entry to match the products objects
          // ++ this gonna be tough to understand ++
          let userProducts = [];
          eachUser.forEach((user) => {
            const [userId, addedProducts] = user;
            const userProds = Object.entries(addedProducts.addedProducts);
            userProds.forEach((prod, idx) => {
              const product = {
                id: prod[0],
                name: prod[1].prodName,
                price: prod[1].prodPrice,
                category: prod[1].prodTags,
                image: prod[1].prodImgData || "No image",
                userId,
              };
              userProducts.push(product);
            });
          });
          commit("addProductsToLocal", { reqProds, userProducts });
          commit("filterCategories");
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
  async signup({ commit }, payload) {
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
  async signIn({ commit }, payload) {
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
        payload.isLoggedIn = true;
        localStorage.setItem("userId", res.data.localId);
        localStorage.setItem("idToken", res.data.idToken);
      })
      .catch(
        (err) => (
          localStorage.clear(),
          (payload.errorInfo = err.response.data.error.message)
        )
      );
    commit("signIn", payload.email);
  },
  getUserData({ commit }, payload) {
    commit("getUserData", payload);
  },
  // THIS BELOW IS FOR TESTING PURPOSES
  sendRequest({ commit, state }, payload) {
    try {
      axios
        .post(
          `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${payload.userId}.json`,
          { userId: payload.userId, giga: "chad" }
        )
        .catch((err) => (payload.errorInfo = err));

      commit("sendRequest", { userId: payload.userId });
    } catch (err) {
      state.auth.errorInfo = err.message
    }
  },
  addProduct({ _, state }, payload) {
    console.log(state.auth.userData.prodImgUrl);
    axios.post(
      `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${payload.userId}/addedProducts.json`,
      {
        prodName: payload.prodName,
        prodPrice: payload.prodPrice,
        prodTags: payload.prodTags,
        prodImgData: state.auth.userData.prodImgUrl,
        // prodImage: `gs://e-ex-ddc18.appspot.com/images/${payload.userId}/${payload.fileName}`
      }
    );
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
                image: prod[1].prodImage || "No image",
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
    // const addHistory = await axios.post(`https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/deletedProducts/${prodId}.json`) // Maybe another time
  },
  logout({ commit }) {
    commit("logout");
  },
  clearLog({ commit }) {
    commit("clearLog");
  },
};
