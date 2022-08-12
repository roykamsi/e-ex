<template>
  <keep-alive>
    <section>
      <h2>Login</h2>
      <form @submit.prevent="signIn">
        <input
          type="email"
          required
          placeholder="e-mail"
          v-model.trim="userEmail"
        />
        <input
          type="password"
          required
          placeholder="password"
          v-model.trim="userPassword"
        />
        <button type="submit" to="/account">Login</button>
        <button type="button" @click="signup">Signup instead</button>
      </form>
      <div v-if="outputError">
        <p class="error">There was an error with the submit.</p>
        <p class="error__detail">{{ outputError }}</p>
        <button type="button" @click="clearLog">Gotcha</button>
      </div>
    </section>
  </keep-alive>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const userEmail = ref("");
const userPassword = ref("");

const outputError = computed(() => store.getters["getError"]);
const isLoggedIn = computed(() => store.getters["isLoggedIn"]);

let userToken = localStorage.getItem("userId");

const loginPayload = {
  userId: userToken,
  firstName: null,
  lastName: null,
  addedProducts: [],
  removedProducts: [],
};

async function signup() {
  await store.dispatch("signup", {
    email: userEmail.value,
    password: userPassword.value,
    userId: userToken
  });
  if (!outputError.value && isLoggedIn.value) {
    return await router.replace(`/account/${userToken}`);
  }
}

async function signIn() {
  try {
    await store.dispatch("signIn", {
      email: userEmail.value,
      password: userPassword.value,
      userToken: userToken,
    });
    router.replace(`/products`);
  } catch {
    throw console.log("Something went wrong");
  }
}

// function debug() {
//   console.log(isLoggedIn.value)
//   }
//   setInterval(debug, 1500);

function clearLog() {
  store.dispatch("clearLog");
}
</script>

<style scoped>
section {
  display: flex;
  min-height: 80vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
form {
  margin: 2rem auto;
  max-width: 25rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
input {
  padding: 0.6rem;
  width: 100%;
}
div > button {
  margin-top: 1rem;
}
</style>
