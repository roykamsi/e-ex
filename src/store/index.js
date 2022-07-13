import { createStore } from "vuex";
import products from "./modules/products/index.js";

const store = createStore({
  modules: {
    products: {
      products,
      namespaced: true,
    },
  },
});

export default store;
