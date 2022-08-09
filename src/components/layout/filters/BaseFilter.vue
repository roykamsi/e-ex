<template>
  <div>
    <h2>Filter products</h2>
    <div>
      <label for="name">By name</label>
      <input type="text" id="name" v-model.trim="fName" />
    </div>
    <div>
      <label for="name">By price: {{ fPrice }} $</label>
      <input
        type="range"
        min="0"
        max="1000"
        step="50"
        id="name"
        v-model="fPrice"
      />
    </div>
    <div>
      <label for="name">By category</label>
      <button @click="allTrue">
        {{ !selectAll ? "Select All" : "Deselect All" }}
      </button>
      <ul>
        <li v-for="cat in catMerged" :key="cat">
          <input
            type="checkbox"
            name="category"
            :id="cat"
            :value="cat"
            v-model="fCheckbox"
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

let fName = ref("");
let fPrice = ref(+1000);
let fCheckbox = ref([]);
let selectAll = ref(false);

// GETTING EACH ARRAY
const catArray = ref([]);
let getProducts = computed(()=>store.getters['getProducts']);
let filterUndefinedProducts = getProducts.value.filter(el => el !== undefined)

let products = filterUndefinedProducts

function showConsoleLog() {
  console.log(getProducts.value);
} showConsoleLog()

for (const prod of products) {
  catArray.value.push(prod.category);
}
// FLATTING IT
const catFlat = computed(() => catArray.value.flat(1));
// UNITING IT
const catMerged = computed(() => [...new Set(catFlat.value)]);

// TRANSFERRING TO STORE MANAGER
watch(
  () => fName.value,
  (state) => store.commit("setFilters", { name: state })
); // NAME
watch(
  () => fPrice.value,
  (state) => store.commit("setFilters", { price: Number(state) })
); // PRICE
watch(
  () => fCheckbox.value,
  (state) => store.commit("setFilters", { checkbox: state })
); // CHECKBOX

// ASYNC UNIT TESTING //
// setInterval(() => {
//   console.log(store.state.filters.checkbox);
// }, 2000);

// STATE MANAGER RETURNING FILTERING INPUT DATA
// const fName = computed(()=>filter.name)
// const fPrice = computed(()=>filter.price)
// const fCheckbox = computed(()=>filter.checkbox)

// FILTERING SYSTEM

function allTrue() {
  let selectionData = ref(catMerged); //This is the array to be added
  selectAll.value = !selectAll.value;
  if (selectAll.value) {
    return selectionData.value.forEach((item) => fCheckbox.value.push(item));
  } else {
    return (fCheckbox.value.length = 0);
  }
}

async function setFilter() {
  const filtered = await products.filter((prod) => {
    // CHECK IF A CHECKBOX VALUE IS INCLUDED IN THE PROD. CATEGORIES
    if (fCheckbox.value === undefined || fCheckbox.value.length === 0 && fName.value.length === 0) {
      allTrue()
      return prod.price <= fPrice.value;
    } else if (fCheckbox.value.length > 0 && fName.value.length === 0 || fName.value === undefined) {
      return (
        prod.price <= fPrice.value &&
        prod.category.some((v) => fCheckbox.value.some((c) => v === c))
      );
    } else if(fName.value.length > 0 || fCheckbox.value.length > 0) {
      return (
        prod.price <= fPrice.value &&
        prod.category.some((v) => fCheckbox.value.some((c) => v === c)) &&
        prod.name.toLowerCase().includes(fName.value)
      );
    }
  });
  store.commit("loadFilteredProducts", filtered);
  emit("updateProds");
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
