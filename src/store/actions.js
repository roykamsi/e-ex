export default {
  loadProducts({ commit, payload }) {
    commit("getProducts", payload);
  },
  loadFilteredProducts({ commit, payload }) {
    commit("loadFilteredProducts", payload);
  },
};
