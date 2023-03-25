import { router } from '@/router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useMainStore } from '../store/store'

const store = useMainStore()
const url = store.ServerIp

const request = axios.create({
  baseURL: url,
  timeout: 5000,
})

request.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    const login = store.Login
    if (login) {
      config.headers['X-Authorization'] = 'Bearer ' + login.token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  async (response) => {
    if (response.config.responseType === 'blob') {
      return response
    }
    if (typeof response.data === 'string') {
      response.data = response.data ? JSON.parse(response.data) : response.data
    }
    if (response.data.status) {
      response.data.status = Number(response.data.status)
      if (response.data.status != 200) {
        ElMessage.error(response.data.message)
      }
    }
    return response
  },
  async (error) => {
    if (error.response.data.message === 'Token has expired') {
      ElMessage.error(error.response.data.message)
      await router.push('/login')
      location.reload()
    }
    return Promise.reject(error)
  }
)

export default request
