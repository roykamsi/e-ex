export default {
  removeProd(state) {
    state.products = state.products.slice(-4, -1)
    console.log(state.products);
  },
  addProductsToLocal(state, payload) {
    state.products = payload.reqProds;
  },
  setFilters(state, payload) {
    state.filters.name = payload.name;
    state.filters.price = payload.price;
    state.filters.checkbox = payload.checkbox;
  },
  filterCategories(state) {
    // GETTING EACH ARRAY TO EXTRACT IT INTO A SINGLE ARRAY OF UNIQUE CATEGORIES
    for (const prod of state.products) {
      state.filters.catArray.push(prod.category);
    }
    // FLATTING IT
    state.filters.catFlat = state.filters.catArray.flat(1);
    // UNITING IT
    state.filters.catMerged = [...new Set(state.filters.catFlat)];
  },
  allTrue(state, payload) {
    state.filters.selectAll = !state.filters.selectAll;
    if (state.filters.selectAll) {
      return state.filters.catMerged.forEach((item) =>
        payload.fCheckbox.push(item)
      );
    } else {
      return (payload.fCheckbox.length = 0);
    }
  },
  loadFilteredProducts(state) {
    state.products = state.filteredProducts;
  },
  async signup(state, payload) {
    state.auth.isLoggedIn = payload.isLoggedIn;
    state.auth.errorInfo = payload.errorInfo;
  },
  async signIn(state, payload) {
    state.auth.isLoggedIn = payload.isLoggedIn;
    state.auth.errorInfo = payload.errorInfo;
  },
  getUserData(state, payload) {
    state.auth.userData.userId = payload.userId;
    state.auth.userData.firstName = payload.firstName;
    state.auth.userData.lastName = payload.lastName;
    state.auth.userData.addedProducts = payload.addedProducts;
    state.auth.userData.removedProducts = payload.removedProducts;
  },
  sendRequest(state, payload) {
    state.auth.userData.userId = payload.userId;
    state.auth.errorInfo = payload.errorInfo;
  },
  updateProducts(state, payload) {
    state.products.push(payload);
  },
  logout(state) {
    state.auth.isLoggedIn = false;
    localStorage.clear();
  },
  clearLog(state) {
    state.auth.errorInfo = null;
  },
};
