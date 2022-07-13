export default {
  loadProducts({commit, payload}) {
    commit('getProducts', payload)
  }
}