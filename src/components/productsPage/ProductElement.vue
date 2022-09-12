<template>
  <base-card>
    <div class="img-container">
      <img :src="pimage" :alt="pname + ' ' + 'image'" />
    </div>
    <h2>{{ pname }}</h2>
    <div>
      <span class="categories" v-for="cat in pcategory" :key="cat">
        {{ cat }}
      </span>
      <p>Price: <span class="editPrice">{{ pprice }}</span>$</p>
    </div>
    <div class="edit-buttons">
      <button v-if="checkIfPersonalProduct" @click="removeProduct">Remove</button>
    </div>
    <h6 v-if="!checkIfPersonalProduct && puserName">Seller: {{puserName}}</h6>
  </base-card>
</template>

<script setup>
import { useStore } from "vuex";
import { defineProps, defineEmits, computed, ref } from "vue";
import { useRoute } from "vue-router";

const props = defineProps(["pname", "pimage", "pprice", "pcategory", "puserName", "pid"]);
defineEmits(["removeProduct"]);

const route = useRoute();
const store = useStore();

// Check if we are in the store and if it's user's product
let isUsersProduct = computed(() => store.getters.isUsersProduct);
const actualRoute = route.path.slice(1);
let checkIfPersonalProduct = isUsersProduct && actualRoute === "mystore"; 

const userId = localStorage.getItem("userId");
const idToken = localStorage.getItem("idToken");

// REMOVE BUTTON
function removeProduct() {
  store.dispatch("removeProduct", { prodId: props.pid, userId, authToken: idToken })
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


button {
  width: 100%;
  display: flex;
  display: block;
  margin: 1rem auto;
}
</style>
