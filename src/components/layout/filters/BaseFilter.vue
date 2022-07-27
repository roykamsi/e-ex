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
      />
    </div>
    <div>
      <label for="name">By category</label>
      <button @click="allTrue">Select all</button>
      <ul>
        <li v-for="cat in catMerged" :key="cat">
          <input
            type="checkbox"
            name="category"
            :id="cat"
            :value="cat"
            v-model="checkboxFiltering"
          />
          <label :for="cat">{{ cat }}</label>
        </li>
      </ul>
    </div>
    <button @click="setFilter">Filter products</button>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits } from "vue";
import { useStore } from "vuex";

const store = useStore();
const emit = defineEmits(["updateProds"]);
// const getFilteredProducts = store.getters.filteredProducts;

let nameFiltering = ref("");
let priceFiltering = ref(1000);
let checkboxFiltering = ref([]);
let selectAll = ref(false);

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
  (state) => store.commit("setFilters", { checkbox: state })
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

function allTrue() {
  let selectionData = ref(catMerged); //This is the array to be added
  selectAll.value = !selectAll.value;
  if (!selectAll.value) {
    return selectionData.value.forEach((item) =>
      checkboxFiltering.value.push(item)
    );
  } else {
    return (checkboxFiltering.value.length = 0);
  }
}

function setFilter() {
  console.log(nameFiltering.value, priceFiltering.value, nameFiltering.value);
  const filtered = products.filter((prod) => {
    // CHECK IF A CHECKBOX VALUE IS INCLUDED IN THE PROD. CATEGORIES
    if (fCheckbox.value === undefined && fName.value === undefined) {
      return prod.price <= fPrice.value;
    } else if (fCheckbox.value !== undefined) {
      return (
        prod.price <= fPrice.value &&
        prod.category.some((v) => fCheckbox.value.some((c) => v === c))
      );
    } else if (fName.value !== undefined) {
      allTrue();
      return (
        prod.price <= fPrice.value &&
        prod.category.some((v) => fCheckbox.value.some((c) => v === c)) &&
        prod.name.toLowerCase().includes(fName.value)
      );
    }
  });
  store.commit("loadFilteredProducts", filtered);
  emit("updateProds");
  console.log(filtered);
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
