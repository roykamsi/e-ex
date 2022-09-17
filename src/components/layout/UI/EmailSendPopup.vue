<template>
    <section v-if="!isMessageSended">
      <BaseCard>
        <h1>Send a message </h1>
        <form @submit.prevent="sendMessageToUser">
          <span class="input-sender-data">
            <label for="userName">User name</label>
            <input type="text" id="userName" v-model="senderName" required/>
          </span>
          <span class="input-sender-data">
            <label for="userEmail">E-mail</label>
            <input type="email" id="userEmail" v-model="senderEmail" required/>
          </span>
          <div class="input-sender-data">
            <label for="message">Message</label>
            <textarea id="message" v-model="senderMessage" required></textarea>
          </div>
          <div class="button-group">
            <button type="submit">Send offer</button>
            <button type="button" @click="cancelMessageSending">Cancel</button>
          </div>
        </form>
      </BaseCard>
    </section>
</template>

<script setup>
import BaseCard from "./BaseCard.vue";
import { computed, defineProps, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const isMessageSended = computed(()=> store.getters.isMessageSended)

defineProps(["selectedUserToSend"]);

const senderName = ref()
const senderEmail = ref()
const senderMessage = ref()

function cancelMessageSending() {
  store.commit('cancelMessageSending')
}


function sendMessageToUser() {
  const prodId = localStorage.getItem('selectedPID')
  store.dispatch('sendMessageToUser', {prodId, senderName: senderName.value, senderEmail: senderEmail.value, senderMessage: senderMessage.value}).then(e => {
    senderMessage.value = ''
  })

}


</script>

<style scoped>
section {
  text-align: left;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  width: 90%;
  background: #fff;
}
input, textarea {
  width: 100%;
}
.button-group {
  display: flex;
  flex-direction: row;
  gap: .8rem;
}
</style>
