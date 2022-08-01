<template>
  <header>
    <nav>
      <h1>
        <router-link to="/">E-Ex</router-link>
      </h1>
      <h2>
        <router-link v-if="!isLogged" to="/login">Login</router-link>
        <span v-else>
          <button @click="toAccount">My account</button>
          <button @click="logout">Logout</button>
        </span>
        <button @click="debug">Debug</button>
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

function debug() {
  return isLogged.value;
}

async function toAccount() {
  const token = localStorage.getItem("userId");
  router.push(`/account/${token}`);
  route.params.aid = token;
}
const isLogged = computed(() => store.getters["isLoggedIn"]);

async function logout() {
  console.log(await store.getters.isLoggedIn);
  await store.dispatch("logout");
  await nextTick()
  debug();
  await router.push("/products");
  console.log(await isLogged.value);
}
</script>

<style lang="scss" scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
button:not(:last-child) {
  margin-right: 2rem;
}
</style>
