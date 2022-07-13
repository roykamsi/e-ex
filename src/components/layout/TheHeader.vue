<template>
  <header>
    <nav>
      <h1>
        <router-link to="/">E-Ex</router-link>
      </h1>
      <span>
        <router-link to="/login">Login</router-link>
      </span>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style lang="postcss" scoped>
header {
  padding: 1rem 5rem;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
