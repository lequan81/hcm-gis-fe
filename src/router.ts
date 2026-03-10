import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";

const router = createRouter({
  history: createWebHistory('/hcm-gis'),
  routes: [
    { path: "/", component: HomeView },
    {
      path: "/about",
      component: () => import("./views/AboutView.vue"),
    },
    {
      path: "/faq",
      component: () => import("./views/FaqView.vue"),
    },
    {
      path: "/policy",
      component: () => import("./views/PolicyView.vue"),
    },
  ],
});

export default router;
