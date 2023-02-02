import { createApp } from "vue"
import App from "./App.vue"

import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import zhCn from "element-plus/dist/locale/zh-cn.mjs"

import "./assets/css/main.css"
import axios from "axios"

import { router } from "./router/index.js"
import { createPinia } from "pinia"
import piniaPersist from "pinia-plugin-persist"

const pinia = createPinia()
const app = createApp(App)

app.config.globalProperties.$axios = axios

app
  .use(router)
  .use(pinia.use(piniaPersist))
  .use(ElementPlus, { locale: zhCn })
  .mount("#app")
