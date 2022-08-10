<template>
  <div>
    <h2>Filter products</h2>
    <div>
      <label for="name">By name</label>
      <button @click="removeProd">Remove 1 product</button>
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

let products = computed(() => store.getters["getProducts"]);
let selectAll = computed(() => store.getters["getSelectAll"]);

// TESTING AREA 🧪 //
// ***************
// function showConsoleLog() {
//   console.log(products.value);
// }
// // TESTING AJAX REQUEST
// const test = setInterval(() => {
//   showConsoleLog();
// }, 2000);
// setTimeout(() => {
//   clearInterval(test);
// }, 6000);

function removeProd() {
  store.commit('removeProd')
}

// ***************

const catMerged = computed(() => store.getters["getCategories"]);

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
  store.commit('allTrue', {fCheckbox: fCheckbox.value})
}

async function setFilter() {
  store.dispatch("productFilterer", {
    fName: fName.value,
    fCheckbox: fCheckbox.value,
    fPrice: fPrice.value,
  });
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
