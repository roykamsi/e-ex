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
        <input type="text" id="prodName" v-model="prodName" />
      </p>
      <p>
        <label for="prodPrice">Product price</label>
        <input type="number" id="prodPrice" v-model="prodPrice" />
      </p>
      <p>
        <label>Product name</label>
        <vue-tags-input
          v-model="tag"
          :tags="prodTagsRaw"
          @tags-changed="(newTags) => (prodTagsRaw = newTags)"
          class="tag-input"
        />
      </p>
      <p v-if="errorInfo" class="error">{{ errorInfo }}</p>
      <p><button type="submit" @click="addProduct">Add product</button></p>
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

const store = useStore();

const errorInfo = computed(() => store.getters.getError);
const userId = localStorage.getItem("userId");
const userProducts = computed(() => store.getters["getUserProducts"]);
const prodTagsRaw = ref([]);
const prodTags = ref([]);
const tag = ref("");
const prodName = ref("");
const prodPrice = ref(0);

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

async function addProduct() {
  prodTagsRaw.value.forEach((el) => prodTags.value.push(el.text));
  await store.dispatch("addProduct", {
    userId: userId,
    prodName: prodName.value,
    prodPrice: prodPrice.value,
    prodTags: prodTags.value,
  });
  await store.dispatch("addAndUpdateUserProducts", {
    userId,
    errorInfo: errorInfo.value,
  });
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
