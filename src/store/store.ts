import { useSessionStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: number
  img: string
  menus: number[]
  token: string
  userName: string
  freezerId: number[]
  goods: string[]
}

const user = ref()

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
      return user.value
    },
    setUser(data: any) {
      user.value = useSessionStorage('user', data)
    },
  },
})
