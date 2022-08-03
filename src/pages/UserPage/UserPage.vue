<template>
  <section>
    <h1>My personal account</h1>
    <h2>Added products</h2>
    <p>{{errorInfo}}</p>
    <button type="button" @click="sendRequest">Send request</button>
    <ul>
      <!-- <li v-for="userProducts"></li> -->
    </ul>
  </section>
</template>

<script setup>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";

const store = useStore();

const errorInfo = computed(() => store.getters.getError)
const userId = localStorage.getItem("userId");

function sendRequest() {
  store.dispatch('sendRequest', {userId: userId})
}

store.dispatch("getUserData", {
  userId,
  firstName: null,
  lastName: null,
  addedProducts: [],
  removedProducts: [],
});
</script>

<style lang="postcss" scoped></style>
