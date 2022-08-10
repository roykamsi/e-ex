export default {
  getProducts(state) {
    return state.products;
  },
  getCategories(state) {
    return state.filters.catMerged
  },
  getSelectAll(state) {
    return state.filters.selectAll
  },
  getFilters(state) {
    return state.filters
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
