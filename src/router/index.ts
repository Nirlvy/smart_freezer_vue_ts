import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
      component: () => import('../components/Login_bg.vue'),
      children: [
        {
          path: '/login',
          component: () => import('../views/Login.vue'),
        },
        {
          path: '/register',
          component: () => import('../views/Register.vue'),
        },
      ],
    },
    {
      path: '/:catchAll(.*)',
      component: () => import('../views/404.vue'),
    },
  ],
})

export const setRotes = () => {
  const user = sessionStorage.getItem('main')
  if (user) {
    const manageRoutes = {
      path: '/manage',
      component: () => import('../components/Manage.vue'),
      children: [
        {
          path: 'home',
          component: () => import('../views/Home.vue'),
        },
        {
          path: 'person',
          name: '个人信息',
          component: () => import('../views/Person.vue'),
        },
      ],
    }
    const menus = JSON.parse(user).user
    if (menus.menus.includes(3)) {
      const itemMenu = {
        path: 'freezer',
        name: '设备管理',
        component: () => import('../views/Freezer.vue'),
      }
      manageRoutes.children.push(itemMenu)
    }
    if (menus.menus.includes(4)) {
      const itemMenu = {
        path: 'goods',
        name: '商品管理',
        component: () => import('../views/Goods.vue'),
      }
      manageRoutes.children.push(itemMenu)
    }
    if (menus.menus.includes(5)) {
      const itemMenu = {
        path: 'role',
        name: '管理控制',
        component: () => import('../views/Role.vue'),
      }
      manageRoutes.children.push(itemMenu)
    }
    if (menus.menus.includes(7)) {
      const itemMenu = {
        path: 'user',
        name: '用户记录',
        component: () => import('../views/User.vue'),
      }
      manageRoutes.children.push(itemMenu)
    }
    router.addRoute(manageRoutes)
  }
}

setRotes()
