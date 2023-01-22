import { createRouter, createWebHistory } from "vue-router"

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
      component: () => import("../components/Login_bg.vue"),
      children: [
        {
          path: "/login",
          component: () => import("../views/Login.vue"),
        },
        {
          path: "/register",
          component: () => import("../views/Register.vue"),
        },
      ],
    },
    {
      path: "/:catchAll(.*)",
      component: () => import("../views/404.vue"),
    },
  ],
})

export const setRotes = () => {
  const store = localStorage.getItem("user")
  if (store) {
    const manageRoutes = {
      path: "/manage",
      component: () => import("../components/Manage.vue"),
      children: [
        {
          path: "home",
          component: () => import("../views/Home.vue"),
        },
        {
          path: "person",
          name: "个人信息",
          component: () => import("../views/Person.vue"),
        },
      ],
    }
    const menus = JSON.parse(store)
    if (menus.menus.includes(4)) {
      let itemMenu = {
        path: "goods",
        name: "商品控制",
        component: () => import("../views/Goods.vue"),
      }
      manageRoutes.children.push(itemMenu)
    }
    if (menus.menus.includes(6)) {
      let itemMenu = {
        path: "role",
        name: "访问控制",
        component: () => import("../views/Role.vue"),
      }
      manageRoutes.children.push(itemMenu)
    }
    if (menus.menus.includes(8)) {
      let itemMenu = {
        path: "user",
        name: "用户记录",
        component: () => import("../views/User.vue"),
      }
      manageRoutes.children.push(itemMenu)
    }
    router.addRoute(manageRoutes)
  }
}

setRotes()
