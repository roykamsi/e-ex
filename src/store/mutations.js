import axios from "axios";
import config from '../../config.js'
import {useRouter} from 'vue-router'

const router = useRouter()

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
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${config.API_KEY}`,
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
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.API_KEY}`,
        {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }
      )
      .then((res) => {
        this.clearLog
        state.auth.isLogged = true
        localStorage.setItem('userId', res.data.localId)
        localStorage.setItem("idToken", res.data.idToken);
      })
      .catch((err) => (
        localStorage.clear(),
        state.auth.isLoggedIn = false,
        console.log(err),
        state.auth.errorInfo = err.message
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
