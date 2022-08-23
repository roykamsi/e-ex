import { fbStorage, uploadBytes, ref, getDownloadURL } from "../firebaseInit.js";

export default {
  addProductsToLocal(state, { reqProds, userProducts }) {
    state.products = reqProds.concat(userProducts);
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
  async signIn(state, payload) {
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
  // IMAGE UPLOADING IS COMMITTED IN THE **UserPage.Vue**
  uploadImage(state, { imageName, imageData }) {
    const getRef = ref(fbStorage, imageName);

    uploadBytes(getRef, imageData)
      .then(()=> {
          getDownloadURL(getRef).then(url=>{
            state.auth.userData.prodImgUrl = url
          })
        }
      )
      .catch((err) => {
        console.log(err);
      });
  },
  logout(state) {
    state.auth.isLoggedIn = false;
    localStorage.clear();
  },
  clearLog(state) {
    state.auth.errorInfo = null;
  },
};
