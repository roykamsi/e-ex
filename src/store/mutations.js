import axios from "axios";
import config from '../../config.js'

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
    state.auth.isLoggedIn = payload.isLoggedIn
    state.auth.errorInfo = payload.errorInfo
  },
  async signIn(state, payload) {
    state.auth.isLoggedIn = payload.isLoggedIn
    state.auth.errorInfo = payload.errorInfo
  },
  getUserData(state, payload) {
    state.auth.userData.userId = payload.userId;
    state.auth.userData.firstName = payload.firstName;
    state.auth.userData.lastName = payload.lastName;
    state.auth.userData.addedProducts = payload.addedProducts;
    state.auth.userData.removedProducts = payload.removedProducts;
  },
  sendRequest(state, payload) {
    state.auth.userData.userId = payload.userId
    state.auth.errorInfo = payload.errorInfo
  },
  addProduct(state, payload) {
    payload.userId = state.auth.userData.userId || localStorage.getItem('userId')
    state.auth.addedProducts = payload.addedProduct
  },
  logout(state) {
    state.auth.isLoggedIn = false
    localStorage.clear();
  },
  clearLog(state) {
    state.auth.errorInfo = null;
  }
};
