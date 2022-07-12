import { createRouter, createWebHistory } from "vue-router";
import { ProductList } from '../pages/productsPage/ProductList.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/products",
      name: "products",
      component: ProductList,
    },
    {path: "/products", component: ProductList},
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
