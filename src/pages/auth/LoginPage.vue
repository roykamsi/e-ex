<template>
  <keep-alive>
    <section>
      <form @submit.prevent="signIn">
        <h2>Login</h2>
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
          autocomplete="on"
        />
        <div class="buttons-wrapper">
          <button type="submit" to="/account">Login</button>
          <button type="button" @click="signup">Signup instead</button>
        </div>
        <div v-if="outputError">
          <p class="error">There was an error with the submit.</p>
          <p class="error__detail">{{ outputError }}</p>
          <button type="button" @click="clearLog">Gotcha</button>
        </div>
      </form>
      <div class="image-wrapper">
        <img
          src="../../img/undraw_secure_login_pdn4.svg"
          alt="Secure login image"
        />
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

const outputError = computed(() => store.getters.getError);
const isLoggedIn = computed(() => store.getters["isLoggedIn"]);

let userToken = computed(
  () => localStorage.getItem("userId") || store.getters.userToken
);

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
    userId: userToken.value,
  });
  if (!outputError.value && isLoggedIn.value) {
    return await router.replace(`/account/${userToken.value}`);
  }
}

async function signIn() {
  try {
    await store.dispatch("signIn", {
      email: userEmail.value,
      password: userPassword.value,
      userToken: userToken.value,
      errorInfo: outputError.value,
    });
    if (!outputError.value && isLoggedIn.value) router.replace(`/products`);
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

<style scoped lang="scss">
section {
  display: flex;
  min-height: 80vh;
  @apply flex-col md:flex-row block md:flex items-stretch;
}
form {
  margin: 2rem auto;
  max-width: 25rem;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 0.8rem;
}
.buttons-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
input {
  padding: 0.6rem;
  width: 100%;
}
div > button {
  margin-top: 1rem;
}
div.image-wrapper {
  @apply md:w-[40vw] w-full;
  margin: 0 auto;
}
</style>
