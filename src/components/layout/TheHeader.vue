<template>
  <header>
    <nav>
      <h1>
        <router-link to="/">E-Ex</router-link>
      </h1>
      <h2>
        <router-link v-if="!isLogged" to="/login">Login</router-link>
        <span v-else>
          <button @click="toPersonalStore">Store</button>
          <button @click="toAccount">Account</button>
          <button @click="logout">Logout</button>
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

function toAccount() {
  const token = localStorage.getItem("userId");
  router.push(`/account/${token}`);
  route.params.aid = token;
}

function toPersonalStore() {
  router.push('/mystore')
}

const isLogged = computed(() => store.getters["isLoggedIn"])

async function logout() {
  await store.dispatch("logout");
  await nextTick();
  await router.push("/products");
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
