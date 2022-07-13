<template>
  <div>
    <h2>Product List</h2>
    <product-element :v-for="product in products" v-key="product" :pname="products.name"></product-element>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ProductElement from '../../components/productsPage/ProductElement.vue'

const store = useStore();
const param = useRoute();
const products = store.getters["products/producList"];
console.log(products);
(async function getProducts() {
  return await store.dispatch("products/loadProducts", products);
})();
</script>

<style lang="postcss" scoped></style>
