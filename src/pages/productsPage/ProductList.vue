<template>
  <main>
    <aside>
      <base-filter @updateProds="updateProductList"></base-filter>
    </aside>
    <section>
      <h2>Product List</h2>
      <h1 v-if="products.length === 0">
        No products yet.
      </h1>
      <div v-else>
        <product-element
          v-for="product in products"
          :key="product.id"
          :pid="product.id"
          :pname="product.name"
          :pprice="product.price"
          :pcategory="product.category || product.category.text"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ProductElement from "../../components/productsPage/ProductElement.vue";
import BaseFilter from "../../components/layout/filters/BaseFilter.vue";
import axios from "axios";
import { createDOMCompilerError } from "@vue/compiler-dom";

const store = useStore();
useRoute();
useRouter();
let products = computed(() => store.getters["getProducts"]);

// const filteredProducts = computed(() => store.getters["getFilteredProducts"]).value;
const isFiltering = computed(() => store.getters["isFiltering"]);
const errorInfo = computed(() => store.getters.getError);
const userId = localStorage.getItem("userId");

  store.dispatch("loadProducts")
  
async function getProducts() {
  if (isFiltering.value) {
    return (products.value = computed(
      () => store.getters["getFilteredProducts"]
    ).value);
  } else {
    return (products.value.filter((el) => el !== undefined));
  }
}
// getProducts(); // IIFE

function updateProductList() {
  return getProducts();
}
</script>

<style lang="scss" scoped>
h2 {
  margin-bottom: 1.5rem;
}
main {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 4fr;
  align-items: start;
}
section > div {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}
div {
  margin: 0 auto;
  width: 100%;
  max-width: 70vw;
}
aside {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
