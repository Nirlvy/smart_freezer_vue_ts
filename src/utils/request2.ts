import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useMainStore } from '../store/store'

const store = useMainStore()
const url = store.ServerIp2

const request2 = axios.create({
  baseURL: url,
  timeout: 5000,
})

request2.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request2.interceptors.response.use(
  async (response) => {
    if (response.config.responseType === 'blob') {
      return response
    }
    if (typeof response.data === 'string') {
      response.data = response.data ? JSON.parse(response.data) : response.data
    }
    return response
  },
  async (error) => {
    ElMessage.error(error.response.data.msg)
    return Promise.reject(error)
  }
)

export default request2
