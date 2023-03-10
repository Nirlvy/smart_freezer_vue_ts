import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    ServerIp: 'http://124.222.184.107/api',
    Blur: false,
    Login: {} as Login,
    Jwt: {} as JWT,
    User: {} as USER,
  }),
  persist: {
    enabled: true,
    strategies: [{ paths: ['Login', 'Jwt', 'User'] }],
  },
  actions: {},
})

export const useFreezerStore = defineStore('freezer', {
  state: () => ({
    cardValue: {
      total: 0,
      online: 0,
      release: 0,
      enable: 0,
      warn: 0,
      pure: 0,
    } as CardValue,
  }),
})
