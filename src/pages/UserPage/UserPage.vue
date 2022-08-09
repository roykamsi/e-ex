<template>
  <section>
    <h1>My personal account</h1>
    <h2>Added products</h2>
    <p>{{ errorInfo }}</p>
    <form @submit.prevent>
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
      <button type="submit" @click="addProduct">Add product</button>
    </form>
    <ul>
      <!-- <li v-for="usrProd in userProducts" :key="usrProd.id"></li> -->
    </ul>
  </section>
</template>

<script setup>
import { computed, ref } from "@vue/runtime-core";
import { useStore } from "vuex";

const store = useStore();

const errorInfo = computed(() => store.getters.getError);
const userId = localStorage.getItem("userId");
const userProducts = computed(() => store.getters("getAddedProducts"));
const prodTagsRaw = ref([]);
const prodTags = ref([])
const tag = ref("");
const prodName = ref("");
const prodPrice = ref(0);

async function addProduct() {
  prodTagsRaw.value.forEach(el => prodTags.value.push(el.text))
  console.log(prodTags.value);
  await store.dispatch("addProduct", {
    userId: userId,
    prodName: prodName.value,
    prodPrice: prodPrice.value,
    prodTags: prodTags.value,
  });
  await store.dispatch("fetchProducts", { userId, errorInfo: errorInfo.value });
}

store.dispatch("getUserData", {
  userId,
  firstName: null,
  lastName: null,
  addedProducts: [],
  removedProducts: [],
});
</script>

<style scoped>
/* The ***vue-tags-input*** component has scoped styling, 
so you can edit it with !important in the ../style/vue-tags.css file.
Docs: http://www.vue-tags-input.com/#/examples/styling
*/
</style>
