import axios from "axios";

export default {
  loadProducts(state, payload) {
    state.getters[("getProducts", payload)];
  },
  setFilters(state, payload) {
    state.filters.name = payload.name;
    state.filters.price = payload.price;
    state.filters.checkbox = payload.checkbox;
  },
  loadFilteredProducts(state, payload) {
    state.filteredProducts = payload;
  },
  async signup(state, payload) {
    await axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDDT4X8ksRdIkRZ6f5SlQoP_RrOYgE9Pkw",
        {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }
      )
      .then((res) => {
        console.log(res);
        this.clearLog()
        state.auth.isLoggedIn = true;
        state.auth.userId = res.data.localId;
        localStorage.setItem("idToken", res.data.idToken);
      })
      .catch((err) => (state.auth.errorInfo = err.response.data.error.message));
  },
  async signIn(state, payload) {
    await axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDDT4X8ksRdIkRZ6f5SlQoP_RrOYgE9Pkw",
        {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }
      )
      .then((res) => {
        console.log(res);
        state.auth.isLoggedIn = true
        this.clearLog
        localStorage.setItem('userId', res.data.localId)
        localStorage.setItem("idToken", res.data.idToken);
      })
      .catch((err) => (
        state.auth.isLoggedIn = false,
        state.auth.errorInfo = err
        ));
  },
  login(state, payload) {
    state.auth.isLoggedIn = true;
    state.auth.userData.userId = payload.userId;
    state.auth.userData.firstName = payload.firstName;
    state.auth.userData.lastName = payload.lastName;
    state.auth.userData.addedProducts = payload.addedProducts;
    state.auth.userData.removedProducts = payload.removedProducts;
  },
  logout(state) {
    localStorage.clear();
    state.auth.isLoggedIn = false;
  },
  clearLog(state) {
    state.auth.errorInfo = null;
  }
};
