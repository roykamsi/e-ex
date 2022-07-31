import base from './style/base.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import config from '../config.js'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import BaseCard from './components/layout/UI/BaseCard.vue'

const app = createApp(App)


app.use(router)
app.use(store)
app.use(VueAxios, axios)
app.use(base)
app.use(config)

app.component("BaseCard", BaseCard)

app.mount('#app')
