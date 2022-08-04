<template>
  <section>
    <h1>My personal account</h1>
    <h2>Added products</h2>
    <p>{{ errorInfo }}</p>
    <button type="button" @click="sendRequest">Send request</button>
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
          :tags="prodTags"
          @tags-changed="(newTags) => (tags = newTags)"
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
const addedProducts = ref([]);
const prodTags = ref([]);
const tag = ref("");
const prodName = ref("");
const prodPrice = ref(0);

function sendRequest() {
  store.dispatch("sendRequest", {
    userId: userId,
  });
}

function addProduct() {
  addedProducts.value.push({
    prodName: prodName.value,
    prodPrice: prodPrice.value,
    prodTags: prodTags.value,
  });
  store.dispatch("addProduct", {
    addedProducts: addedProducts.value,
  });
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
