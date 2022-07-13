import { createRouter, createWebHistory } from "vue-router";
import ProductList from '../pages/productsPage/ProductList.vue'
import ProductElement from '../components/productsPage/ProductElement.vue'
import LoginPage from '../pages/auth/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/products",
      name: "products",
      component: ProductList,
      children: [{
        name: "ProductElement",
        path: "/products/:pid",
        component: ProductElement,
      }],
    },
    {path: "/login", name: 'Login', component: LoginPage},
  ],
});

export default router;
