<template>
  <header>
    <nav>
      <h1>
        <router-link to="/">E-Ex</router-link>
      </h1>
      <h2>
        <button v-if="!isLogged" @click="router.replace('/login')">
          Login
        </button>
        <span v-else>
          <router-link to="/mystore" class="heading-button">Store</router-link>
          <router-link to="/account" class="heading-button">Account</router-link>
          <button class="heading-button" @click="logout">Logout</button>
        </span>
      </h2>
    </nav>
  </header>
</template>

<script setup>
import { computed, nextTick } from "vue";
import { useStore } from "vuex";
import { RouterLink, useRoute, useRouter } from "vue-router";

const store = useStore();
const route = useRoute();
const router = useRouter();


const isLogged = computed(() => store.getters["isLoggedIn"])

async function logout() {
  await store.dispatch("logout");
  await nextTick();
  await router.push("/products");
}
</script>

<style lang="scss" scoped>
  header {
    @apply p-4 bg-slate-100 rounded-md mb-8
  }
  
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
a:not(:last-child) {
  margin-right: 2rem;
}
a:hover {
  cursor: pointer
}
</style>
