export default {
  loadProducts(state, payload) {
    state.getters['getProducts', payload]
  },
  setFilters(state, payload) {
    state.filters.name = payload.name
    state.filters.price = payload.price
    state.filters.checkbox = payload.checkbox
  },
  loadFilteredProducts(state, payload) {
    state.products = payload
  }
};
