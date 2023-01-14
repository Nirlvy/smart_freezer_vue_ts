import { createApp } from "vue"
import App from "./App.vue"

import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import zhCn from "element-plus/dist/locale/zh-cn.mjs"

import "./assets/main.css"
import axios from "axios"

import { variable } from "./assets/globalvariable.js"

import { router } from "./router/index.js"

const app = createApp(App)

app.config.globalProperties.$axios = axios
app.provide("variable", variable)

app.use(router).use(ElementPlus, { locale: zhCn }).mount("#app")
