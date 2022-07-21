import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import BaseCard from './components/layout/UI/BaseCard.vue'

const app = createApp(App)


app.use(router)
app.use(store)

app.component("BaseCard", BaseCard)

app.mount('#app')
