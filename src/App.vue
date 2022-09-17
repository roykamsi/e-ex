<script setup>
import { includes } from "italian-badwords-list/lib/array";
import { RouterView } from "vue-router";
import TheHeader from "./components/layout/TheHeader.vue";
import { firebaseApp, fbStorage, uploadBytes, ref } from "./firebaseInit.js";
import EmailSendPopup from "./components/layout/UI/EmailSendPopup.vue";

</script>

<template>
  <section>
    <the-header></the-header>
    <div>
      <router-view v-slot="{ Component }">
        <Transition
          enter-active-class="animate__animated animate__fadeInUp animate__faster"
          leave-active-class="animate__animated animate__fadeOutDown animate__faster"
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </router-view>
    </div>
  </section>
</template>

<style lang="scss">
@import "./assets/base.css";
@import "animate.css";

section {
  text-align: center;
}

.page {
  position: absolute;
  width: inherit;
}
</style>
