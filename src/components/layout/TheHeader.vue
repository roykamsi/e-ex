<template>
  <header>
    <nav>
      <h1>
        <router-link to="/">E-Ex</router-link>
      </h1>
      <h2>
          <router-link to="/login">Login</router-link>
      </h2>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style lang="scss" scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
