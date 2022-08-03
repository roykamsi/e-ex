import { createRouter, createWebHistory } from "vue-router";
import ProductList from "../pages/productsPage/ProductList.vue";
import ProductElement from "../components/productsPage/ProductElement.vue";
import LoginPage from "../pages/auth/LoginPage.vue";
import AccountPage from "../pages/auth/AccountPage.vue";
import UserPage from "../pages/userPage/UserPage.vue";

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
    { path: "/products", name: "products", component: ProductList },
    {
      path: "/login",
      name: "Login",
      component: LoginPage,
    },
    {
      path: "/account/:uid",
      name: "Account",
      component: AccountPage,
    },
    {path: '/mystore', name: 'personal account', component: UserPage}
  ],
});

export default router;
