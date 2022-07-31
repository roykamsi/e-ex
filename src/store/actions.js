export default {
  loadProducts({ commit, payload }) {
    commit("getProducts", payload);
  },
  loadFilteredProducts({ commit, payload }) {
    commit("loadFilteredProducts", payload);
  },
  signup({commit}, payload) {
    commit('signup', payload)
  },
  signIn({commit}, payload) {
    commit('signIn', payload)
  },
  login({ commit }, payload) {
    commit("login", payload);
  },
  logout({ commit }) {
    commit("logout");
  },
  clearLog({commit}) {
    commit('clearLog')
  }
};
