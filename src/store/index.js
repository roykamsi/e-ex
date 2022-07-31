import { createStore } from "vuex";
import products from "./data/productList.js";
import getters from "./getters.js";
import actions from "./actions.js";
import mutations from "./mutations.js";
import filters from './data/filters.js'
import filteredProducts from './data/filteredProducts.js'
import auth from './data/auth.js'

const store = createStore({
  state() {
    return {
      filters,
      products,
      filteredProducts,
      auth
    };
  },
  getters,
  mutations,
  actions,
});

export default store;
