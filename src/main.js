import base from './style/base.css'
import vueTags from './style/vue-tags.css'
import config from '../config.js'
import jQuery from 'jquery'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import BaseCard from './components/layout/UI/BaseCard.vue'
import VueTagsInput from '@sipec/vue3-tags-input'
import ProductElement from "./components/productsPage/ProductElement.vue";
import ItemsGridder from './components/productsPage/ItemsGridder.vue'
import EmailSendPopup from './components/layout/UI/EmailSendPopup.vue'

const app = createApp(App)

app.use(jQuery)
app.use(router)
app.use(store)
app.use(VueAxios, axios)


app.component("EmailSendPopup", EmailSendPopup)
app.component("BaseCard", BaseCard)
app.component("VueTagsInput", VueTagsInput)
app.component('ProductElement', ProductElement)
app.component('ItemsGridder', ItemsGridder)

app.mount('#app')
