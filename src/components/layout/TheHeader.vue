<template>
  <header>
    <nav>
      <h1>
        <router-link to="/">E-Ex</router-link>
      </h1>
      <h2>
        <router-link v-if="!isLogged" to="/login">Login</router-link>
        <button v-if="isLogged" @click="toAccount">My account</button>
        <button v-if="isLogged" @click="logout">Logout</button>
        <button @click="checkLog">Debug</button>
      </h2>
    </nav>
  </header>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { RouterLink, useRoute, useRouter } from "vue-router";

const store = useStore();
const route = useRoute();
const router = useRouter();

const isLogged = computed(() => store.getters['isLoggedIn']);


async function toAccount() {
  const token = await store.getters["userToken"];
  router.push(`/account/${token}`);
  route.params.aid = token;
}

async function logout() {
  await store.dispatch("logout");
  console.log(isLogged.value, store.getters["isLoggedIn"]);
  router.push("/products");
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
