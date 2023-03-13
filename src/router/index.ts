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
      const jwt = JSON.parse(main).Jwt
      if (Object.keys(jwt).length === 0) {
        return
      }
      if (jwt.enabled === true) {
        const itemMenu = [
          {
            path: 'freezer',
            name: '设备管理',
            component: () => import('../views/Freezer/index.vue'),
          },
          {
            path: 'goods',
            name: '商品管理',
            component: () => import('../views/Goods.vue'),
          },
          {
            path: 'role',
            name: '管理控制',
            component: () => import('../views/Role.vue'),
          },
          {
            path: 'user',
            name: '用户记录',
            component: () => import('../views/User.vue'),
          },
        ]
        manageRoutes.children = manageRoutes.children.concat(itemMenu)
      }
      router.addRoute(manageRoutes)
    }
    resolve()
  })
}

setRotes()
