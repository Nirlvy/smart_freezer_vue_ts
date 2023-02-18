import { defineStore } from 'pinia'
interface User {
  id: number
  img: string
  menus: number[]
  token: string
  userName: string
  goods: string[]
}
interface Freezer {
  freezerId: number
  disabled: boolean
  capacity: number
  shelves: number
}
export const useStore = defineStore('main', {
  state: () => ({
    // TODO:编译前修改
    ServerIp: 'http://8.130.47.235:8080',
    blur: false,
    user: {} as User,
    freezer: [] as Freezer[],
  }),
  persist: {
    enabled: true,
    strategies: [{ paths: ['user', 'freezer'] }],
  },
  actions: {
    setValue<T extends keyof Freezer>(prop: T, values: Freezer[T][]) {
      if (this.freezer.length === 0) {
        values.forEach((item) => {
          this.freezer.push({
            [prop]: item,
            freezerId: 0,
            disabled: false,
            capacity: 0,
            shelves: 0,
          })
        })
      }
      for (let i = 0; i < values.length; i++) {
        this.freezer[i][prop] = values[i]
      }
    },
    getValue<T extends keyof Freezer>(prop: T) {
      return this.freezer.map((item) => item[prop])
    },
    getIndex<T extends keyof Freezer>(prop: T, data: number | string) {
      return this.freezer.findIndex((item) => item[prop] === Number(data))
    },
    getTime() {
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
      const day = currentDate.getDate().toString().padStart(2, '0')
      const hours = currentDate.getHours().toString().padStart(2, '0')
      const minutes = currentDate.getMinutes().toString().padStart(2, '0')
      const seconds = currentDate.getSeconds().toString().padStart(2, '0')
      const time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      return time
    },
  },
})
