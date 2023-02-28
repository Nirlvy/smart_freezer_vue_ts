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
  return new Promise<void>((resolve) => {
    const main = sessionStorage.getItem('main')
    if (main) {
      const manageRoutes = {
        path: '/manage',
        component: () => import('../components/Manage.vue'),
        children: [
          {
            path: 'home',
            component: () => import('../views/Home/index.vue'),
          },
          {
            path: 'person',
            name: '个人信息',
            component: () => import('../views/Person.vue'),
          },
        ],
      }

      const user = JSON.parse(main).user
      if (Object.keys(user).length === 0) {
        return
      }
      if (user.menus.includes(3)) {
        const itemMenu = {
          path: 'freezer',
          name: '设备管理',
          component: () => import('../views/Freezer.vue'),
        }
        manageRoutes.children.push(itemMenu)
      }
      if (user.menus.includes(4)) {
        const itemMenu = {
          path: 'goods',
          name: '商品管理',
          component: () => import('../views/Goods.vue'),
        }
        manageRoutes.children.push(itemMenu)
      }
      if (user.menus.includes(5)) {
        const itemMenu = {
          path: 'role',
          name: '管理控制',
          component: () => import('../views/Role.vue'),
        }
        manageRoutes.children.push(itemMenu)
      }
      if (user.menus.includes(7)) {
        const itemMenu = {
          path: 'user',
          name: '用户记录',
          component: () => import('../views/User.vue'),
        }
        manageRoutes.children.push(itemMenu)
      }
      router.addRoute(manageRoutes)
    }
    resolve()
  })
}

setRotes()
