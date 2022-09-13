import { createRouter, createWebHistory } from "vue-router";
import ProductList from "../pages/productsPage/ProductList.vue";
import ProductElement from "../components/productsPage/ProductElement.vue";
import LoginPage from "../pages/auth/LoginPage.vue";
import AccountPage from "../pages/auth/AccountPage.vue";
import UserPage from "../pages/userPage/UserPage.vue";
import {computed} from 'vue'
import store from '../store'


const isLoggedIn = computed(()=>store.getters.isLoggedIn)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/products",
      name: "home",
      children: [
        {
          name: "ProductElement",
          path: "/products/:pid",
          component: ProductElement,
        },
      ],
    },
    { path: "/products", name: "products", component: ProductList},
    {
      path: "/login",
      name: "Login",
      component: LoginPage,
      meta: {requiresUnAuth: true}
    },
    {
      path: "/account/:uid",
      name: "Account",
      component: AccountPage,
      meta: {requiresAuth: true}
    },
    {path: '/mystore', name: 'personal account', component: UserPage, meta: {requiresAuth: true}}
  ],
});

router.beforeEach(function (to, _, next) {
  if(to.meta.requiresAuth && !isLoggedIn.value) {
    next('/login')
  } else if (to.meta.requiresUnAuth && isLoggedIn.value) {
    next('/products')
  } else next()
});

export default router;
