<template>
  <div>
    <h2>Filter products</h2>
    <div>
      <label for="name">By name</label>
      <input type="text" id="name" v-model.lazy="nameFiltering" />
    </div>
    <div>
      <label for="name">By price: {{ priceFiltering }} $</label>
      <input
        type="range"
        min="0"
        max="1000"
        step="50"
        id="name"
        v-model="priceFiltering"
        @change="setFilter"
      />
    </div>
    <div>
      <label for="name">By category</label>
      <ul>
        <li v-for="cat in catMerged" :key="cat">
          <input
            type="checkbox"
            name="category"
            :id="cat"
            :value="cat"
            v-model="checkboxFiltering"
            @click="setFilter"
          />
          <label :for="cat">{{ cat }}</label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits } from "vue";
import { useStore } from "vuex";

const store = useStore();
const emit = defineEmits(["updateProds"]);
// const getFilteredProducts = store.getters.filteredProducts;

const nameFiltering = ref("");
const priceFiltering = ref(0);
const checkboxFiltering = ref([]);

// GETTING EACH ARRAY
const catArray = ref([]);
let products = computed(function () {
  return store.getters.getProducts;
}).value;

for (const prod of products) {
  catArray.value.push(prod.category);
}
// FLATTING IT
const catFlat = computed(() => catArray.value.flat(1));
// UNITING IT
const catMerged = computed(() => [...new Set(catFlat.value)]);

// TRANSFERRING TO STORE MANAGER
watch(
  () => nameFiltering.value,
  (state) => store.commit("setFilters", { name: state })
); // NAME
watch(
  () => priceFiltering.value,
  (state) => store.commit("setFilters", { price: Number(state) })
); // PRICE
watch(
  () => checkboxFiltering.value,
  (state) => (store.state.filters.checkbox = state)
); // CHECKBOX

// ASYNC UNIT TESTING //
// setInterval(() => {
//   console.log(store.state.filters.checkbox);
// }, 2000);

// STATE MANAGER RETURNING FILTERING INPUT DATA
const fName = computed(() => store.state.filters.name);
const fPrice = computed(() => store.state.filters.price);
const fCheckbox = computed(() => store.state.filters.checkbox);

// FILTERING SYSTEM

function setFilter() {
  emit("updateProds");
  console.log(products, fCheckbox.value);
  const filtered = products.filter((v) => v.price <= fPrice.value && v.category.includes(fCheckbox.value))
  store.commit("loadFilteredProducts", filtered);
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  align-items: start;
}
li {
  display: flex;
  gap: 1rem;
  justify-content: start;
}
</style>