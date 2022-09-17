<template>
  <section>
    <h1>My store</h1>
    <section class="products-grid" v-if="getAddedProducts.length != 0">
      <items-gridder>
        <product-element
          v-for="product in userProducts"
          :key="product.id"
          :pid="product.id"
          :pname="product.name"
          :pprice="product.price"
          :pimage="product.image"
          :pcategory="product.category || product.category.text"
        />
      </items-gridder>
    </section>
    <p v-if="isUploaded">
      <button @click="newUpload">
        {{
          getAddedProducts.length != 0
            ? "Add another product"
            : "Add your first product"
        }}
      </button>
    </p>
    <div class="form-nest">
      <form @submit.prevent="checkBeforeAddingProduct" v-if="!isUploaded">
        <h2>Add a product</h2>
        <p>
          <label for="uploadImage">Upload Image</label>
          <input
            type="file"
            accept="image/jpeg"
            id="uploadImage"
            @change="imageData"
          />
        </p>
        <p>
          <label for="prodName">Product name</label>
          <input
            type="text"
            id="prodName"
            v-model="prodName"
            placeholder="20+ characters allowed"
          />
        </p>
        <p>
          <label for="prodPrice">Product price</label>
          <input
            type="number"
            id="prodPrice"
            v-model="prodPrice"
            placeholder="25$ or more"
          />
        </p>
        <p>
          <label>Product tags</label>
          <vue-tags-input
            v-model="tag"
            :tags="prodTagsRaw"
            @tags-changed="(newTags) => (prodTagsRaw = newTags)"
            class="tag-input"
            :validation="validation"
            :autocomplete-items="getSuggestedCategories"
          />
        </p>
        <p>
          <br />
          <button type="submit">Add product</button>
        </p>
      </form>
      <form @submit.prevent="editProduct" class="editing-form" v-if="userProducts.length > 0">
        <div>
          <select name="product" id="productSelect" @change="selectedProduct">
            <option disabled selected>-- Edit a product --</option>
            <option
              v-for="product in userProducts"
              :key="product.id"
              :value="product.id"
              :pname="product.name"
            >
              {{ product.name }}
            </option>
          </select>
        </div>
        <div class="input-data" v-if="getSelectedProduct && editActive">
          <p>
            <input
              type="text"
              id="prodName"
              v-model="newProdName"
              placeholder="Product name"
            />
          </p>
          <p>
            <input
              type="number"
              id="prodPrice"
              v-model="newProdPrice"
              placeholder="Product price"
            />
          </p>
          <p>
            <label>Product tags</label>
            <vue-tags-input
              v-model="newTag"
              :tags="newArrayToRaw"
              @tags-changed="(newTags) => (newArrayToRaw = newTags)"
              class="tag-input"
              :validation="validation"
              :autocomplete-items="getSuggestedCategories"
            />
          </p>
          <div class="editing-buttons">
            <button type="submit">Confirm</button>
            <button type="button" @click="cancelProdEditing">Cancel</button>
          </div>
        </div>
      </form>
    </div>
    <p v-if="errorInfoLocal" class="error">
      {{ errorInfoLocal }}
    </p>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import badWords from "../../store/data/italianBadWordsList.js";
import errorMessages from "../../store/data/errorMessages.js";

const store = useStore();
const router = useRouter();

const isLoggedIn = computed(()=> store.getters.isLoggedIn)

const editActive = ref(true);
const reactiveSelectedProdId = ref();
const getSelectedProduct = computed(() => store.getters.getSelectedProduct);

const errorInfoLocal = ref("");
const errorInfo = computed(() => store.getters.getError);

const userId = localStorage.getItem("userId");
const userProducts = computed(() => store.getters["getUserProducts"]);
const isUploaded = computed(() => store.getters.isUploaded);
const getSuggestedCategories = computed(
  () => store.getters["getSuggestedCategories"]
);
const getAddedProducts = computed(() => store.getters.getAddedProducts);

const prodName = ref("");
const prodPrice = ref();

const newProdName = ref("");
const newProdPrice = ref(null);
const newTag = ref();
const newArrayToRaw = ref([]); // SECOND TAG ARRAY
const newProdTags = ref([]);

// AUTO-LOGOUT checker
if (isLoggedIn.value) {
    store.commit("autoLogout");
  }

// TAG MANAGEMENT
const prodTagsRaw = ref([]);
const prodTags = ref([]);
const tag = ref("");
watch(tag, () => {
  store.state.filters.tag = tag;
  isTagBadWord();
});
function isTagBadWord() {
  const checkVal = badWords.some((word) =>
    tag.value.toLowerCase().includes(word)
  );
  if (checkVal) {
    tag.value = errorMessages.BAD_WORDS;
    return setTimeout(() => (tag.value = ""), 1000);
  }
}
const validation = ref([
  {
    classes: "no-numbers",
    rule: /^([^0-9]*)$/,
    disableAdd: true,
  },
  {
    classes: "no-braces",
    rule: ({ text }) => text.indexOf("{") !== -1 || text.indexOf("}") !== -1,
    disableAdd: true,
  },
]);

// IMAGE UPLOADING
const file = ref();
function imageData(e) {
  if (e.target.files[0].size > 1000000) {
    return (errorInfoLocal.value = errorMessages.IMAGE_TOO_HEAVY);
  } else if (!e.target.files.length) {
    return (errorInfoLocal.value = errorMessages.NO_FILE);
  } else {
    file.value = e.target.files[0];
    errorInfoLocal.value = null;
  }
}
// function uploadImage() {
//   store.commit("uploadImage", {
//     image: `images/${userId}/${file.value.name}`,
//   });
// } // Devi sincronizzare i dati quando vengono caricati e scaricati con l'MD5 data, controlla Firebase DOCS

store.dispatch("fetchUserProducts", { userId });

// ADDING PRODUCT
function checkBeforeAddingProduct() {
  if (
    file.value &&
    prodName.value !== "" &&
    prodName.value.match(/(?!^\d+$)^.+$/) && // NO only numbers in the name
    prodName.value.length > 21 &&
    !badWords.some((word) => prodName.value.includes(word)) &&
    prodPrice.value > 25 &&
    prodTagsRaw.value.length > 0
  ) {
    addProduct();
  } else {
    if (prodName.value === "") {
      errorInfoLocal.value = "The product name is empty.";
    } else if (!file.value) {
      errorInfoLocal.value = "Image not detected.";
    } else if (!prodName.value.match(/(?!^\d+$)^.+$/)) {
      errorInfoLocal.value = "Only numbers is not allowed.";
    } else if (prodName.value.length < 21) {
      errorInfoLocal.value = "Be more concise with the product name.";
    } else if (
      badWords.some((word) => prodName.value.toLowerCase().includes(word))
    ) {
      errorInfoLocal.value = errorMessages.BAD_WORDS;
    } else if (prodPrice.value < 25) {
      errorInfoLocal.value = "The price is too low.";
    } else if (prodTagsRaw.value.length < 0) {
      errorInfoLocal.value = "At least one tag is required.";
    } else {
      errorInfoLocal.value = "There was an error with your input data.";
    }
  }
}
async function addProduct() {
  prodTagsRaw.value.forEach((el) => prodTags.value.push(el.text));
  if (!errorInfoLocal.value) {
    await store.dispatch("uploadImage", {
      imageData: file.value,
      imageName: `images/${userId}/${file.value.name}`,
    });
    await store.dispatch("addProduct", {
      prodName: prodName.value,
      prodPrice: prodPrice.value,
      prodTags: prodTags.value,
      userId,
    });

    if (isUploaded.value) {
      await store.dispatch("addAndUpdateUserProducts", {
        userId,
        errorInfo: errorInfo.value,
      });
      setTimeout(() => {
        store.dispatch("fetchUserProducts", { userId }); // Fetch the products async
      }, 500);
    }
    // START EMPTYING VALUES
    file.value = null;
    prodTagsRaw.value.length = 0;
    tag.value = "";
    prodPrice.value = "";
    prodName.value = "";
    // END EMPTYING VALUES
  } else return;
}
function newUpload() {
  return store.commit("newProdUpload");
}

// EDIT THE PRODUCT

async function selectedProduct() {
  const selectedProdId = document.querySelector("select").value;
  activateProdEdit();

  await store.dispatch("selectedProduct", {
    selectedProdId,
    userId,
  });
  reactiveSelectedProdId.value = getSelectedProduct.value;
  if (getSelectedProduct.value) {
    updateProdInfo();
  }
}

function updateProdInfo() {
  newProdName.value = "Loading...";
  newProdPrice.value = "Loading...";
  newProdName.value = reactiveSelectedProdId.value.prodName;
  newProdPrice.value = reactiveSelectedProdId.value.prodPrice;

  // EDITING THE CATEGORIES
  let convertNewArrayToRaw = [];
  let reConvertNewTagListFromRaw = [];

  reactiveSelectedProdId.value.prodTags.forEach((el) => {
    const element = {
      text: el,
    };
    convertNewArrayToRaw.push(element); // NOW EACH ELEMENT HAS .text BEFORE
  });

  newArrayToRaw.value.forEach((el) => {
    reConvertNewTagListFromRaw.push(el.text);
  });
  newArrayToRaw.value = convertNewArrayToRaw; // ASSIGNING THE TAG VALUES TO THE NEW ONE
  newProdTags.value = reConvertNewTagListFromRaw;
}

async function editProduct() {
  const selectedProdId = document.querySelector("select").value;
  updateProdInfo();
  // AJAX
  if (selectedProdId) {
    store.commit("prodUploaded");
    await store.dispatch("patchEditedProduct", {
      userId,
      selectedProdId: selectedProdId,
      editedProdName: newProdName.value,
      editedProdPrice: newProdPrice.value,
      editedProdTags: newProdTags.value,
    });
  }
  store.dispatch("fetchUserProducts", { userId });
}
function cancelProdEditing() {
  document.querySelector("select").selectedIndex = 0;
  deactivateProdEdit();
}
function activateProdEdit() {
  return (editActive.value = true);
}
function deactivateProdEdit() {
  return (editActive.value = false);
}
</script>

<style scoped lang="scss">
/* 
The ***vue-tags-input*** component has scoped styling, 
so you need to edit it with !important in the ../style/base.css file.
Docs: http://www.vue-tags-input.com/#/examples/styling
*/
section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: column;
  gap: 0.6rem;
}

@media only screen and (min-width: 767px) {
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .form-nest:not(h2) {
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    gap: 1rem;
  }
  form.editing-form {
    flex-direction: column;
    gap: 1rem;
  }
  .input-data {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

.products-grid {
  margin: 1.5rem auto;
}

.bad-words {
  color: red;
}

.editing-buttons {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
}
</style>
