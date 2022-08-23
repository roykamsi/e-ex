<template>
  <section>
    <h1>My account</h1>
    <div v-if="!isRegistered">
      <h2>Hi! You haven't set up your data yet!</h2>
      <form @submit.prevent="setUserData">
        <input type="text" placeholder="Your name (not required)" v-model="name"/>
        <input type="text" placeholder="Your last name (not required)" v-model="lastName"/>
        <div>
          <h2><label for="userName">Choose a great user name</label></h2>
          <input type="text" name="userName" id="userNames" v-model="userName" required aria-required="true"/>
        </div>
        <button type="submit">Yeah, that's correct</button>
        <details>
          <summary>What's needed for</summary>
          <p>
            <em
              >Only your username will be used to be displayed along the product
              you've displayed.</em
            >
          </p>
        </details>
      </form>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

const name = ref("");
const lastName = ref("");
const userName = ref("");

const store = useStore();

const isRegistered = computed(() => store.getters.isRegistered);

function setUserData() {
  const userId = localStorage.getItem("userId");
  store.dispatch("setUserData", {
    userId,
    firstName: name.value,
    lastName: lastName.value,
    userName: userName.value,
  });
}
</script>

<style lang="scss"></style>
