export default {
  getProducts(state) {
    return state.products;
  },
  getFilteredProducts(state) {
    return state.filteredProducts
  },
  isFiltering(state) {
    return state.filters.name  || state.filters.price || state.filters.checkbox.length
  }
};
