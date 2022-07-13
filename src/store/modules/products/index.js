import { createStore } from "vuex";
import productList from '../../productList.js'
import getters from './getters.js'
import actions from './actions.js'
import mutations from './mutations.js'

const store = createStore({
  state() {
    return {
      productList
    }
  },
  getters,
  mutations,
  actions
});

export default store;
