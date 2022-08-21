<template>
  <main>
    <aside>
      <base-filter></base-filter>
    </aside>
    <section>
      <h2>Product List</h2>
      <h1 v-if="products.length === 0">No products yet.</h1>
      <div v-else>
        <product-element
          v-for="product in products"
          :key="product.id"
          :pid="product.id"
          :pimage="product.image"
          :pname="product.name"
          :pprice="product.price"
          :pcategory="product.category"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import BaseFilter from "../../components/layout/filters/BaseFilter.vue";

const store = useStore();
useRoute();
useRouter();
// const isFiltering = computed(() => store.getters["isFiltering"]);
store.dispatch("loadProducts");

let products = computed(() => store.getters['getProductsOrFilteredProducts']);

onMounted(()=> setTimeout(()=>console.log(products.value), 2000))

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
}
aside {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
