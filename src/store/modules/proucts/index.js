import { createStore } from "vuex";
import productList from '../../productList.js'

const store = createStore({
  state() {
    return {
      productList
    }
  },
  getters: {
    getProducts(state) {
      return state.productList
    }
  }
});

export default store;
