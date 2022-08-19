<template>
  <section>
    <h1>My personal account</h1>
    <h2>Added products</h2>
    <form @submit.prevent>
      <p>
        <label for="uploadImage">Upload Image</label>
        <input type="file" id="uploadImage" @change="uploadImage" />
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
          :pcategory="product.category || product.category.text"
        />
      </items-gridder>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import badWords from "../../store/data/italianBadWordsList.js";

const store = useStore();
const router = useRouter();

const errorInfoLocal = ref("");
const errorInfo = computed(() => store.getters.getError);

const userId = localStorage.getItem("userId");
const userProducts = computed(() => store.getters["getUserProducts"]);
const prodTagsRaw = ref([]);
const prodTags = ref([]);
const tag = ref("");
let catSuggested = ref([]);
const prodName = ref("");
const prodPrice = ref();

// SUGGESTED CATEGORIES
const getSuggestedCategories = computed(() => {
  let tag2 = tag2.value;
  let catMerged = catMerged.value;
  let catSuggested = catSuggested.value;
  let newArr = [];
  for (const tag of catMerged) {
    const tags = { text: tag };
    newArr.push(tags);
  }
  console.log(catSuggested);
  console.log(tag2);
  catSuggested.filter((i) => {
    return i.text.toLowerCase().indexOf(tag2.toLowerCase()) !== -1;
  });
  return false
});

// IMAGE UPLOADING
function uploadImage(e) {
  if (!e.target.files.length) return;
  const file = e.target.files[0];
  console.log(file);
  store.commit("uploadImage", {
    image: `images/${file.name}`,
  });
}
store.dispatch("fetchProducts", { userId });

// ADDING PRODUCT
function checkBeforeAddingProduct() {
  if (
    prodName.value !== "" &&
    prodName.value.match(/(?!^\d+$)^.+$/) && // NO only numbers in the name
    prodName.value.length > 21 &&
    !badWords.some((word) => prodName.value.includes(word)) &&
    prodPrice.value > 25 &&
    prodTagsRaw.value.length > 0
  ) {
    addProduct();
  } else {
    errorInfoLocal.value = "There was an error with your input data.";
  }
}

async function addProduct() {
  prodTagsRaw.value.forEach((el) => prodTags.value.push(el.text));
  await store.dispatch("addProduct", {
    prodName: prodName.value,
    prodPrice: prodPrice.value,
    prodTags: prodTags.value,
    userId,
  });
  await store.dispatch("addAndUpdateUserProducts", {
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
