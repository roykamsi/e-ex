<template>
  <base-card>
    <div class="img-container">
      <img :src="pimage" :alt="pname" />
    </div>
    <h2>{{ pname }}</h2>
    <div>
      <span class="categories" v-for="cat in pcategory" :key="cat">
        {{ cat }}
      </span>
      <p>Price: {{ pprice }} $</p>
    </div>
    <button v-if="checkIfPersonalProduct" @click="removeProduct">Remove</button>
  </base-card>
</template>

<script setup>
import { useStore } from "vuex";
import { defineProps, defineEmits, computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps(["pname", "pimage", "pprice", "pcategory", "pid"]);
const emit = defineEmits(["removeProduct"]);

const route = useRoute();
const store = useStore();

// Check if we are in the store and if it's user's product
let isUsersProduct = computed(() => store.getters.isUsersProduct);
const presentRoute = route.path.slice(1);
let checkIfPersonalProduct = isUsersProduct && presentRoute === "mystore"; 

const userId = localStorage.getItem("userId");

// REMOVE BUTTON
function removeProduct() {
  store.dispatch("removeProduct", { prodId: props.pid, userId })
}
</script>

<style lang="scss" scoped>
.categories:not(:last-child) {
  display: inline-block;
  margin: 0.4rem;
  outline: 1px solid rgba(#777, 0.2);
  border-radius: 2.26px;
  padding: 0.2rem 0.8rem;
}
.img-container {
  width: 50%;
  text-align: center;
  margin: 0 auto;
}
</style>
