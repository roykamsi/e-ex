export default {
  getProducts(state) {
    return state.products;
  },
  getCatMerged(state) {
    return state.filters.catMerged;
  },
  getFilters(state) {
    return state.filters
  },
  getFilteredProducts(state) {
    return state.filteredProducts
  },
  getAddedProducts(state) {
    state.auth.addedProducts
  },
  isFiltering(state) {
    return state.filters.name  || state.filters.price || state.filters.checkbox.length
  },
  isLoggedIn(state) {
    return state.auth.isLoggedIn || localStorage.getItem('idToken')
  },
  userToken(state) {
    return state.auth.userId
  },
  getError(state) {
    return state.auth.errorInfo
  }
};
