<template>
  <main>
    <aside>
      <base-filter @updateProds="updateProductList"></base-filter>
    </aside>
    <section>
      <h2>Product List</h2>
      <div>
        <product-element
          v-for="product in products"
          :key="product.id"
          :pid="product.id"
          :pname="product.name"
          :pprice="product.price"
          :pcategory="product.category"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ProductElement from "../../components/productsPage/ProductElement.vue";
import BaseFilter from "../../components/layout/filters/BaseFilter.vue";

const store = useStore();
useRoute();
useRouter();
let products = ref(null);

const filteredProducts = computed(() => store.getters["getFilteredProducts"]);

async function getProducts() {
  if (filteredProducts.value > 0) {
    return products.value = computed(() => store.getters["getFilteredProducts"]).value
  } else {
    console.log("Actual products");
    return (products.value = computed(() => store.getters["getProducts"]).value);
  }
}
getProducts() // IIFE

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
