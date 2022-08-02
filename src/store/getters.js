export default {
  getProducts(state) {
    return state.products;
  },
  getFilters(state) {
    return state.filters
  },
  getFilteredProducts(state) {
    return state.filteredProducts
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
