import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    ServerIp: 'http://124.222.184.107/api',
    ServerIp2: 'http://8.130.47.235',
    Blur: false,
    Login: {} as Login,
    Jwt: {} as JWT,
    User: {} as USER,
    dialog: false,
    imgBase64: [] as string[],
  }),
  persist: {
    enabled: true,
    strategies: [{ paths: ['Login', 'Jwt', 'User'] }],
  },
})

const totalFreezer = ['全部设备', '在线设备', '投放设备', '启用设备', '设备告警率', '纯净度', '通电设备']

export const useFreezerStore = defineStore('freezer', {
  state: () => ({
    totalFreezer: totalFreezer.map((item) => ({
      name: item,
      value: 0,
    })),
    freezerCard: '全部设备',
    chooseRow: {} as deviceInfo,
    drawer: false,
  }),
  persist: {
    enabled: true,
    strategies: [{ paths: ['totalFreezer'] }],
  },
})

export const useItemStore = defineStore('item', {
  state: () => ({
    id2Item: [] as id2Item[],
    allItem: [] as complexly[],
    itemCount: 0,
    drawer: false,
    items: [
      { label: '购物图片', checked: true },
      { label: '纯净度', checked: true },
      { label: '陈列信息', checked: true },
      { label: '陈列图片', checked: true },
    ],
  }),
  persist: {
    enabled: true,
    strategies: [{ paths: ['id2Item'] }],
  },
})
