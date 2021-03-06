import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import User from "../components/user/Users.vue";
import Rights from "../components/power/Rights.vue";
import Roles from "../components/power/Roles.vue";
import Cate from "../components/goods/Cate.vue"
import Params from "../components/goods/Params.vue"
Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/home", component: Home,
    redirect: "/welcome",
    children: [
      { path: "/welcome", component: Welcome },
      { path: "/users", component: User },
      { path: "/rights", component: Rights },
      { path: "/roles", component: Roles },
      {
        path: "/categories", component: Cate
      },
      {
        path: "/params", component: Params
      }

    ]
  },
];

const router = new VueRouter({
  routes,
});

//  挂载路由导航守卫

export default router
router.beforeEach((to, from, next) => {
  if (to.path === '/login') next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next("/login")
  next();
})




