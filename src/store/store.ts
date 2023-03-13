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
    cardValue: [
      {
        name: '全部设备',
        value: 0,
      },
      {
        name: '在线设备',
        value: 0,
      },
      {
        name: '投放设备',
        value: 0,
      },
      {
        name: '启用设备',
        value: 0,
      },
      {
        name: '设备告警率',
        value: 0,
      },
      {
        name: '纯净度',
        value: 0,
      },
    ] as CardValue,
  }),
  persist: {
    enabled: true,
    strategies: [{ paths: ['cardValue'] }],
  },
})
