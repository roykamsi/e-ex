<template>
    <main>
      <button @click="isFiltering = !isFiltering">{{isFiltering ? 'Hide filtering' : 'Show filtering products'}}</button>
      <aside>
        <base-filter v-if="isFiltering"></base-filter>
      </aside>
      <section>
        <h2>Product List</h2>
        <h1 v-if="products.length === 0">No products yet.</h1>
        <div v-else>
          <product-element
            v-for="product in products"
            :key="product.id"
            :pid="product.id"
            :puserName="product.userName"
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

const isLoggedIn = computed(()=> store.getters.isLoggedIn)

const width = window.innerWidth;

const isFiltering = ref(true);


onMounted(()=> {
  if (width < 768) {
    isFiltering.value = false
  }
  // AUTO-LOGOUT checker
  if (isLoggedIn.value) {
    store.commit("autoLogout");
  }
})

const store = useStore();
useRoute();
useRouter();
// const isFiltering = computed(() => store.getters["isFiltering"]);
const userId = computed(() => localStorage.getItem("userId"));

store.dispatch("loadProducts", { userId: userId.value });
store.dispatch("fetchFirstNameIfRegistered");



let products = computed(() => store.getters["getProductsOrFilteredProducts"]);

// *** TESTING AREA ***
// onMounted(()=> console.log(products.value))
// function debug() {
//   store.dispatch('loadProducts')
// }
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
button {
  display: none;
}
aside {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* mobile */
@media only screen and (max-width: 767px) {
  button {
    display: block;
    margin-right: 50%;
    margin-bottom: 1rem;
  }
  aside > div {
    display: flex;
  }
  main {
    display: block;
  }
  section > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

@media only screen and (max-width: 567px) {
  section > div {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

</style>
