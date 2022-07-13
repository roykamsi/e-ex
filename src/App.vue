<script setup>
import { RouterView } from "vue-router";
import TheHeader from "./components/layout/TheHeader.vue";
</script>

<template>
  <section>
    <the-header></the-header>
    <router-view></router-view>
  </section>
</template>

<style>
@import "./assets/base.css";
section {
  text-align: center;
}
</style>
