import axios from "axios";
import config from "../../config.js";

export default {
  loadProducts({ commit }) {
    axios
      .get(
        `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/products.json`
      )
      .then((res) => {
        const entries = Object.entries(res.data);
        const reqProds = entries[0][1];
        commit("addProductsToLocal", { reqProds });
        commit("filterCategories");
      });
  },
  productFilterer({ commit, state }, {fPrice, fCheckbox, fName}) {
    fPrice = Number(fPrice) //Number to integer
    state.filteredProducts = state.products.filter((prod) => {
      // CHECK IF A CHECKBOX VALUE IS INCLUDED IN THE PROD. CATEGORIES
      if (
        fCheckbox === undefined ||
        (fCheckbox.length === 0 && fName.length === 0)
      ) {
        console.log('allTrue');
        commit("allTrue", { fCheckbox: fCheckbox }); //ACTIVATE ALL CHECKBOXES TO SEARCH GLOBAL
        return prod.price <= fPrice;
      } else if (
        (fCheckbox.length > 0 && fName.length === 0) ||
        fName === undefined
      ) {
        console.table('filtering by price', prod.price, fPrice);
        return (
          prod.price <= fPrice &&
          prod.category.some((v) => fCheckbox.some((c) => v === c))
        );
      } else if (fName.length > 0 || fCheckbox.length > 0) {
        console.log('filtering by name');
        return (
          prod.price <= fPrice &&
          prod.category.some((v) => fCheckbox.some((c) => v === c)) &&
          prod.name.toLowerCase().includes(fName)
        );
      }
    });
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
        console.log(res);
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
  sendRequest({ commit }, payload) {
    try {
      axios
        .post(
          `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${payload.userId}.json`,
          { userId: payload.userId, giga: "chad" }
        )
        .then((res) => console.log(res.data))
        .catch((err) => (payload.errorInfo = err));

      commit("sendRequest", { userId: payload.userId });
    } catch {
      console.log("error occurred");
    }
  },
  addProduct(_1, payload) {
    axios.post(
      `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${payload.userId}/addedProducts.json`,
      {
        prodName: payload.prodName,
        prodPrice: payload.prodPrice,
        prodTags: payload.prodTags,
      }
    );
    // commit("addProduct", payload.addedProduct);
  },
  fetchProducts({ commit }, payload) {
    axios
      .get(
        `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users/${payload.userId}/addedProducts.json`
      )
      .then((res) => {
        const resData = Object.entries(res.data);
        console.log(resData);
        for (const data of resData) {
          const product = {
            id: data[0],
            name: data[1].prodName,
            price: data[1].prodPrice,
            category: data[1].prodTags,
            // image TO BE ADDED ****
          };
          commit("updateProducts", product);
        }
      })
      .catch((err) => {
        console.log(err);
        return (err.message = payload.errorInfo);
      });
    commit("updateProducts");
  },
  logout({ commit }) {
    commit("logout");
  },
  clearLog({ commit }) {
    commit("clearLog");
  },
};
