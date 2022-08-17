<script setup>
import { RouterView } from "vue-router";
import TheHeader from "./components/layout/TheHeader.vue";
import { firebaseApp, fbStorage, uploadBytes, ref } from "./firebaseInit.js";

</script>

<template>
  <section>
    <the-header></the-header>
    <div>
      <router-view> </router-view>
    </div>
  </section>
</template>

<style lang="scss">
@import "./assets/base.css";
section {
  text-align: center;
}
</style>
