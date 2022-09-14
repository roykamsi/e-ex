<template>
  <section>
    <h1>
      {{
      isRegistered
      ? `Welcome to your account ${storedUserName}`
      : "My account"
      }}
    </h1>
    <div v-if="isRegistered">
      <p>Your actual username is {{getUserName}}</p>
      <button @click="activateChangeUserName = true, changeMode.userName = true" v-if="!activateChangeUserName">Change
        your user name</button>
      <button @click="activateChangeUserName = true, changeMode.firstName = true" v-if="!activateChangeUserName">Change
        your name</button>
      <div v-else>
        <input type="text" name="userName" id="userName" v-model="userNameInput">
        <button @click="dispatchChange">Confirm</button>
      </div>
    </div>
    <div v-if="!isRegistered">
      <h2>Hi! You haven't set up your data yet!</h2>
      <form @submit.prevent="setUserData">
        <input type="text" placeholder="Your name (not required)" v-model="name" />
        <input type="text" placeholder="Your last name (not required)" v-model="lastName" />
        <div>
          <h2><label for="userName">Choose a great user name</label></h2>
          <input type="text" name="userName" id="userNames" v-model="userName" required aria-required="true" />
        </div>
        <button type="submit">Confirm</button>
        <details>
          <summary>What's needed for</summary>
          <p>
            <em>Only your username will be used to be displayed along the product
              you've displayed.</em>
          </p>
        </details>
      </form>
    </div>
    <div class="hero">
      <img src="../../../src/img/undraw_account_re_o7id.svg" alt="Profile edit">
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

const activateChangeUserName = ref(false)

const name = ref("");
const lastName = ref("");
const userName = ref("");
const storedUserName = computed(() => store.getters.getFirstName);
const getUserName = computed(() => store.getters.getUserName);
const userNameInput = ref("")
const changeMode = ref({
  userName: false,
  firstName: false
})

const store = useStore();

const isRegistered = computed(() => store.getters.isRegistered);

const userId = localStorage.getItem("userId");

if (!storedUserName.value) {
  store.dispatch("fetchFirstNameIfRegistered");
}

store.commit('autoLogout')

function setUserData() {
  store.dispatch("setUserData", {
    userId,
    firstName: name.value,
    lastName: lastName.value,
    userName: userName.value,
  });
}

function dispatchChange() {
  if (changeMode.value.userName === true) {
    changeUserName()
    changeMode.value.userName === false
  } else if (changeMode.value.firstName === true) {
    changeFirstName()
    changeMode.value.firstName === false
  }
}

async function changeUserName() {
  await store.dispatch('changeUserName', { userId, userNameInput: userNameInput.value })
  activateChangeUserName.value = false
}

async function changeFirstName() {
  await store.dispatch('changeFirstName', { userId, userNameInput: userNameInput.value })
  activateChangeUserName.value = false
}

</script>

<style lang="scss" scoped>
button {
  display: block;
  margin: auto auto;
}

input {
  max-width: 20vw
}

div:not(.hero) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.hero {
  padding: 2rem;
  margin: 0 auto;
  width: 40vw
}
</style>
