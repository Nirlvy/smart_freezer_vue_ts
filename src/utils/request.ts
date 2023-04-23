import { router } from '@/router'
import axios, { AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useMainStore } from '../store/store'
import { refreshToken } from './commonRequset'

const store = useMainStore()
const url = store.ServerIp

const request = axios.create({
  baseURL: url,
  timeout: 5000,
})

const requestQueue: (() => Promise<any>)[] = []

const addRequestToQueue = (config: AxiosRequestConfig<any>): Promise<any> => {
  return new Promise((resolve, reject) => {
    const retry = async (): Promise<any> => {
      try {
        const response = await axios(config)
        resolve(response)
      } catch (error) {
        reject(error)
      }
    }
    requestQueue.push(retry)
  })
}

const retryRequests = () => {
  const requests = requestQueue.splice(0, requestQueue.length)
  requests.forEach((request) => {
    request()
  })
}

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
    return response
  },
  async (error) => {
    if (error.response.data.message === 'Token has expired') {
      const originalRequest = error.config
      const retryPromise = addRequestToQueue(originalRequest)
      const res = await refreshToken()
      if (res) {
        retryRequests()
      } else {
        ElMessage.error(error.response.data.message)
        await router.push('/login')
        location.reload()
      }
      return retryPromise
    }
    ElMessage.error(error.response.data.message)
    return Promise.reject(error)
  }
)

export default request
