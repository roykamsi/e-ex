<template>
  <base-card>
    <div class="img-container">
      <img :src="pimage" :alt="'image not loading'" />
    </div>
    <h2>{{ pname }}</h2>
    <div>
      <span class="categories" v-for="cat in pcategory" :key="cat">
        {{ cat }}
      </span>
    </div>
    <p>
      Price: <span class="editPrice">{{ pprice }}</span
      >€
    </p>
    <div class="edit-buttons">
      <button v-if="checkIsStore" @click="removeProduct">Remove</button>
    </div>
    <h6 v-if="!checkIsStore && puserName">
      Seller: {{ puserName }}
    </h6>
    <button
      v-if="!checkIsStore"
      @click="popUpSendMessageToUser"
    >
      {{ puserName ? `Send a message to ` + puserName : `Send a message` }}
    </button>
  </base-card>
</template>

<script setup>
import { useStore } from "vuex";
import { defineProps, defineEmits, computed} from "vue";
import { useRoute } from "vue-router";
import PopDialog from "../layout/UI/EmailSendPopup.vue";
import { ref } from "vue";

const props = defineProps([
  "pname",
  "pimage",
  "pprice",
  "pcategory",
  "puserName",
  "pid",
]);
const emit = defineEmits(["removeProduct"]);

const route = useRoute();
const store = useStore();
const isMessageSended = computed(()=> store.getters.isMessageSended)

let selectedUserToSend = ref()
async function popUpSendMessageToUser() {
  store.commit('isMessaging')
  localStorage.setItem('selectedPID', props.pid)
  store.commit('getSellerData', {prodId: props.pid})
  selectedUserToSend.value = localStorage.getItem('selectedUser') || ''
}

// Check if we are in the store and if it's user's product
const actualRoute = route.path.slice(1);
const checkIsStore = actualRoute === "mystore";

const userId = localStorage.getItem("userId");
const idToken = localStorage.getItem("idToken");

// REMOVE BUTTON
function removeProduct() {
  store.dispatch("removeProduct", {
    prodId: props.pid,
    userId,
    authToken: idToken,
  });
}

</script>

<style lang="scss" scoped>
.categories {
  @apply text-gray-500 hover:text-gray-700 px-3 py-1 m-1 font-medium text-sm rounded-md inline-block bg-gray-100;
}
.img-container {
  width: 50%;
  text-align: center;
  margin: 0 auto;
}

.editPrice {
  @apply text-2xl font-bold text-sky-900;
}

button {
  width: 100%;
  display: flex;
  display: block;
  margin: 1rem auto;
}
</style>
