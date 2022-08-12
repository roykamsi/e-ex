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
import { ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
// const getFilteredProducts = store.getters.filteredProducts;

let fName = ref("");
let fPrice = ref(+1000);
let fCheckbox = ref([]);

const catMerged = computed(() => store.getters["getCategories"]); // Showing categories
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

// ASYNC UNIT TESTING //
// setInterval(() => {
//   console.log(store.state.filters.checkbox);
// }, 2000);

// STATE MANAGER RETURNING FILTERING INPUT DATA
// const fName = computed(()=>filter.name)
// const fPrice = computed(()=>filter.price)
// const fCheckbox = computed(()=>filter.checkbox)

// ******************

// FILTERING SYSTEM
function allTrue() {
  store.commit("allTrue", { fCheckbox: fCheckbox.value });
}

// Triggers once is starting to filter
async function setFilter() {
  // TRANSFERRING FILTERS TO THE STORE MANAGER
  store.dispatch("setFilters", {
    fName: fName.value,
    fPrice: fPrice.value,
    fCheckbox: fCheckbox.value,
  });
  // CHECKING IF THE CAT. IS EMPTY WHILE LOOKING FOR NAME
  if (fCheckbox.value.length === 0 && fName.value !== undefined) {
    allTrue() //ACTIVATE ALL CHECKBOXES TO SEARCH GLOBAL
  }
  store.getters["getFilterData"]; // Getting the filtered data back
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
