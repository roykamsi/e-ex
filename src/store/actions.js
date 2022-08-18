import axios from "axios";
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
          let renamedUserProds = [];
          // Now let's transform EACH entry to match the products objects
          // ++ this gonna be tough to understand ++
          eachUser.forEach((user) => {
            const [userId, addedProducts] = user;
            const userProds = Object.entries(addedProducts.addedProducts);
            const renameInputData = userProds.forEach((prod) => {
              const [eachProdId] = prod;
              const prodId = eachProdId.slice(1, -1);
              const eachUsrProd = Object.entries(prod[1]);
              const idArr = ["id", prodId]; // Inserting the prodId
              let [name, nameVal] = eachUsrProd[0];
              name = "name";
              let [price, priceVal] = eachUsrProd[1];
              price = "price";
              let [category, catVal] = eachUsrProd[2];
              category = "category";
              // Making out an array for each of them
              const nameArr = Array.from([name, nameVal]);
              const priceArr = Array.from([price, priceVal]);
              const catArr = Array.from([category, catVal]);
              const EACH_USER_PROD = Array.from([
                nameArr,
                priceArr,
                catArr,
                idArr,
              ]);
              // Above you can add more elements to the array

              // Hate to do this s***t but I'm still a newbie :/
              const prodsIntoEntries = Object.fromEntries(EACH_USER_PROD); // Reconverting them into Objects again
              return renamedUserProds.push(prodsIntoEntries); // this is what matters
            });
          });
          commit("addProductsToLocal", { reqProds, renamedUserProds });
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
              };
              products.push(product);
            });
            state.auth.userData.addedProducts = products
          }
        }
      })
      .catch((err) => {
        return (state.auth.errorInfo = err.message);
      });
  },
  addAndUpdateUserProducts({ commit }, payload) {
    axios
      .get(
        `https://e-ex-ddc18-default-rtdb.europe-west1.firebasedatabase.app/users.json`
      )
      .then((res) => {
        const userId = payload.userId;
        const resData = Object.entries(res.data);
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
