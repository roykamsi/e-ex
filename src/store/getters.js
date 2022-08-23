export default {
  isRegistered(state) {
    console.log(state.auth.userData.userName);
    return state.auth.userData.userName
  },
  getProducts(state) {
    return state.products;
  },
  getUserProducts(state) {
    return state.auth.userData.addedProducts;
  },
  isUploaded(state) {
    return state.auth.userData.isUploaded
  },
  isUsersProduct(state) {
    const usrProds = state.auth.userData.addedProducts;
    const localUserId = localStorage.getItem('userId')
    return usrProds.some(el=> el.userId === localUserId)
  },
  getFilteredProducts(state) {
    return state.filteredProducts;
  },
  getCategories(state) {
    return state.filters.catMerged;
  },
  getSuggestedCategories(state) {

    // Here I needed to add a text as key before the tag since the component vue-tag-manager requires it
    let newArr = []
    for (const tag of state.filters.catMerged) {
      newArr.push({text: tag})
    }

    state.filters.catSuggested = newArr.filter((i) => i.text.toLowerCase().indexOf(state.filters.tag.toLowerCase()) !== -1);

    return state.filters.catSuggested
  },
  getSelectAll(state) {
    return state.filters.selectAll;
  },
  getFilterData(state) {
    let fName = state.filters.fName;
    let fPrice = state.filters.fPrice;
    let fCheckbox = state.filters.fCheckbox;

    fPrice = Number(fPrice); //Number to integer
    // FOR TESTING **********************
    // state.filteredProducts = state.products
    // .filter(prod =>
    //   prod.price <= fPrice
    //   )
    // ***********************

    state.filteredProducts = state.products.filter((prod) => {
      // CHECK IF A CHECKBOX VALUE IS INCLUDED IN THE PROD. CATEGORIES
      if (
        fCheckbox === undefined ||
        (fCheckbox.length === 0 && fName.length === 0)
      ) {
        console.log("allTrue");
        return prod.price <= fPrice;
      } else if (
        (fCheckbox.length > 0 && fName.length === 0) ||
        fName === undefined
      ) {
        return (
          prod.price <= fPrice &&
          prod.category.some((v) => fCheckbox.some((c) => v === c))
        );
      } else if (fName.length > 0 || fCheckbox.length > 0) {
        console.log("filtering by name");
        return (
          prod.price <= fPrice &&
          prod.category.some((v) => fCheckbox.some((c) => v === c)) &&
          prod.name.toLowerCase().includes(fName)
        );
      }
    });
  },
  getFilters(state) {
    return state.filters;
  },
  getAddedProducts(state) {
    return state.auth.addedProducts;
  },
  getProductsOrFilteredProducts(state) {
    if (
      state.filters.fName ||
      state.filters.fPrice ||
      state.filters.fCheckbox.length
    ) {
      return state.filteredProducts;
    } else {
      return state.products;
    }
  },
  isLoggedIn(state) {
    return state.auth.isLoggedIn || localStorage.getItem("idToken");
  },
  userToken(state) {
    return state.auth.userId;
  },
  getError(state) {
    return state.auth.errorInfo;
  },
};
