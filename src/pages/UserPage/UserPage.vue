<template>
  <section>
    <h1>My personal account</h1>
    <h2>Added products</h2>
    <form @submit.prevent>
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
          :autocomplete-items="getSuggestedCategories"
        />
      </p>
      <p v-if="errorInfo || errorInfoLocal" class="error">
        {{ errorInfo || errorInfoLocal }}
      </p>
      <p>
        <button type="submit" @click="checkBeforeAddingProduct">
          Add product
        </button>
      </p>
    </form>
    <section class="products-grid">
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
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import badWords from "../../store/data/italianBadWordsList.js";

const store = useStore();
const router = useRouter();

const errorInfoLocal = ref("");
const errorInfo = computed(() => store.getters.getError);

const userId = localStorage.getItem("userId");
const userProducts = computed(() => store.getters["getUserProducts"]);
const getSuggestedCategories = computed(
  () => store.getters["getSuggestedCategories"]
);

const prodName = ref("");
const prodPrice = ref();

// TAG MANAGEMENT
const prodTagsRaw = ref([]);
const prodTags = ref([]);
const tag = ref("");
watch(tag, () => {
  store.state.filters.tag = tag;
});

// IMAGE UPLOADING
const file = ref();
function imageData(e) {
  if (!e.target.files.length) return;
  file.value = e.target.files[0];
}
// function uploadImage() {
//   store.commit("uploadImage", {
//     image: `images/${userId}/${file.value.name}`,
//   });
// } // Devi sincronizzare i dati quando vengono caricati e scaricati con l'MD5 data, controlla Firebase DOCS

store.dispatch("fetchProducts", { userId });

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
    } else if (badWords.some((word) => prodName.value.includes(word))) {
      errorInfoLocal.value = "No bad words allowed!";
    } else if (prodPrice.value < 25) {
      errorInfoLocal.value = "The price is too low.";
    } else if (prodTagsRaw.value.length < 0) {
      errorInfoLocal.value = "At least one tag is required.";
    } else {
      errorInfoLocal.value = "There was an error with your input data.";
    }
  }
}

function addProduct() {
  prodTagsRaw.value.forEach((el) => prodTags.value.push(el.text));
  store.commit("uploadImage", {
    imageData: file.value,
    imageName: `images/${userId}/${file.value.name}`,
  });
  store.dispatch("addProduct", {
    prodName: prodName.value,
    prodPrice: prodPrice.value,
    prodTags: prodTags.value,
    userId,
  });
  store.dispatch("addAndUpdateUserProducts", {
    userId,
    errorInfo: errorInfo.value,
  });
  router.push("/products");
}
</script>

<style scoped>
/* 
The ***vue-tags-input*** component has scoped styling, 
so you need to edit it with !important in the ../style/vue-tags.css file.
Docs: http://www.vue-tags-input.com/#/examples/styling
*/
.products-grid {
  width: 50%;
  margin: 1.5rem auto;
}
</style>
