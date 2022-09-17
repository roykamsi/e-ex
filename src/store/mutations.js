export default {
  addProductsToLocal(state, { reqProds, userProducts }) {
    state.products = reqProds.concat(userProducts);
  },
  newProdUpload(state) {
    state.auth.userData.isUploaded = false;
  },
  prodUploaded(state) {
    state.auth.userData.isUploaded = true;
  },
  filterCategories(state) {
    // GETTING EACH ARRAY TO EXTRACT IT INTO A SINGLE ARRAY OF UNIQUE CATEGORIES
    for (const prod of state.products) {
      state.filters.catArray.push(prod.category);
    }
    // FLATTING IT
    state.filters.catFlat = state.filters.catArray.flat(1);
    // UNITING IT
    state.filters.catMerged = [...new Set(state.filters.catFlat)];
    // MAKING THEM GLOBAL
    localStorage.setItem('prodCategories', [state.filters.catMerged])
  },
  allTrue(state, payload) {
    state.filters.selectAll = !state.filters.selectAll; // Toggling filtering feature
    if (state.filters.selectAll) {
      return state.filters.catMerged.forEach((item) =>
        payload.fCheckbox.push(item)
      );
    } else {
      return (payload.fCheckbox.length = 0);
    }
  },
  loadFilteredProducts(state) {
    state.products = state.filteredProducts;
  },
  async signup(state, payload) {
    state.auth.isLoggedIn = payload.isLoggedIn;
    state.auth.errorInfo = payload.errorInfo;
  },
  sendRequest(state, payload) {
    state.auth.userData.userId = payload.userId;
    state.auth.errorInfo = payload.errorInfo;
  },
  updateProducts(state, payload) {
    state.products.push(payload);
  },
  prodUpdated(state) {
    state.auth.userData.selectedProduct = null
  },
  logout(state) {
    state.auth.isLoggedIn = false;
    state.auth.userData.authToken = null;
    localStorage.clear();
  },
  autoLogout(state) {
    // Retains the timeout even after page refresh
    const waitTime = 1000 * 3600;
    let executionTime;
    const initialTime = localStorage.getItem("initialTime");

    if (initialTime === null) {
      localStorage.setItem("initialTime", new Date().getTime());
      executionTime = waitTime;
    } else {
      executionTime =
        parseInt(initialTime, 10) + waitTime - new Date().getTime();
      if (executionTime < 0) executionTime = 0;
    }
    
    setTimeout(() => {
      state.auth.isLoggedIn = false;
      state.auth.userData.authToken = null;
      localStorage.clear();
    }, executionTime);
  },
  clearLog(state) {
    state.auth.errorInfo = null;
  },
  getSellerData(state, {prodId}) {
    let selectedUID;
    state.products.forEach((el) => {
      if (el.id === prodId) {
        selectedUID = el.userId;
        el.userName !== undefined ? localStorage.setItem('selectedUser', el.userName) : 'the user'
      }
    });
  },
  isMessaging(state) {
    state.messaging.isMessageSended = false
  },
  cancelMessageSending(state) {
    state.messaging.isMessageSended = true
  }
};
