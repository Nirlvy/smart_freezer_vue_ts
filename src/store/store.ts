import { defineStore } from 'pinia'

interface User {
  id: number
  img: string
  menus: [number]
  token: string
  userName: string
}

export const useStore = defineStore('main', {
  state: () => ({
    ServerIp: 'http://localhost:8080',
    blur: false,
    user: {} as User,
  }),
  persist: {
    enabled: true,
    strategies: [{ paths: ['user'] }],
  },
  actions: {
    getUser() {
      return sessionStorage.getItem('user')
        ? JSON.parse(sessionStorage.getItem('user') || '0')
        : {}
    },
    setUser(data: any) {
      sessionStorage.setItem('user', JSON.stringify(data))
    },
  },
})
