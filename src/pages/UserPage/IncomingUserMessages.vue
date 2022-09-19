<template>
  <section>
    <h1>My messages</h1>
    <div class="messages-wrapper">
      <section class="messages-list" v-if="!checkIfMobile">
        <h2>Message list</h2>
        <ul>
          <li v-for="{ id, messageReceived } in fetchedMessages" :key="id">
            <button @click="showMessageDetails(id)">
              {{ messageReceived.senderName }}
            </button>
          </li>
        </ul>
      </section>
      <section class="messages-list" v-if="checkIfMobile">
        <h2>Message list</h2>
        <select @change="showMessageDetails()" v-model="selectedValue">
          <option
            v-for="{ id, messageReceived } in fetchedMessages"
            :key="id"
            :value="id"
            >
            {{ messageReceived.senderName }}
          </option>
        </select>
      </section>
      <section class="messages-details" v-if="selectedMessage">
        <h2>{{selectedMessage.messageReceived.senderName}} asked you</h2>
        <p class="message-received">{{selectedMessage.messageReceived.senderMessage}}</p>
        <h6>His e-email: {{selectedMessage.messageReceived.senderEmail}}</h6>
        <form>
          <input type="text" placeholder="Subject" v-model="senderEmailSubject" required>
          <textarea type="text" placeholder="Message" v-model="senderEmailMessage" required></textarea>
          <button @click.prevent="respondToSender(selectedMessage.messageReceived.senderEmail)">Send it by email</button>
        </form>
        <p v-if="localError" class="warn">{{localError}}</p>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "@vue/runtime-core";
import { useStore } from "vuex";

const userId = localStorage.getItem("userId");
const localError = ref('')

const store = useStore();

const getMessages = computed(() => store.getters.getUserMessages);

let mobileMode = ref(null);
const checkIfMobile = computed(() =>
  width < 768 ? (mobileMode.value = true) : (mobileMode.value = false)
);

onMounted(() => fetchMessages());

const width = window.innerWidth;
let fetchedMessages = ref();
let showMessage = ref(false);
let selectedMessage = ref()


const senderEmailSubject = ref()
const senderEmailMessage = ref()

async function respondToSender(senderEmail) {
  if (senderEmailSubject.value && senderEmailMessage.value) window.location.href = `mailto:${senderEmail}?subject=${senderEmailSubject.value}&body=${senderEmailMessage.value}`; else localError.value = 'Write something first'
}

async function fetchMessages() {
  await store.dispatch("fetchUserIncomingMessages", { userId });
  const receivedMessages = getMessages.value;
  const eachMessage = Object.entries(receivedMessages);
  let newMessageGroup = [];
  eachMessage.forEach((m) => {
    newMessageGroup.push({ id: m[0], messageReceived: m[1] });
  });
  fetchedMessages.value = newMessageGroup;
  console.log(fetchedMessages.value);
}

let selectedValue = ref()

function showMessageDetails(id) {
  id ? id : id = selectedValue.value
  selectedMessage.value = fetchedMessages.value.filter(el => el.id === id)[0]
  showMessage.value = true;
}

</script>

<style scoped>
h1 {
  margin-bottom: 1rem;
}
.messages-wrapper {
  display: grid;
  grid-template-columns: 2fr 6fr;
}
.messages-list {
  display: grid;
  gap: 1rem;
  text-align: left;
}
.messages-details {
  display: grid;
  gap: 1rem;
  text-align: start;
}
.message-received {
  text-align: start;
}
div, form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
}
input {
  margin: 0 0;
}
textarea {
  width: 50%
}
button {
  text-align: center;
}
li:not(:last-child) {
  width: 30%;
  border-bottom: 1px solid var(--secondary);
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
}
p {
  display: inline-block;
  padding: 1rem;
  @apply bg-slate-200 rounded-md;
  width: 100%;
}
p.warn {
  width: 40%;
  @apply bg-red-300
}
@media (max-width: 767px) {
  .messages-wrapper {
    display: grid;
    grid-template-columns: 1fr;
  }
  .messages-list {
    display: grid;
    gap: 1rem;
    text-align: center;
  }
  textarea, input {
  width: 100%
}
p.warn {
  width: 100%;
  @apply bg-red-300
}
}
</style>
