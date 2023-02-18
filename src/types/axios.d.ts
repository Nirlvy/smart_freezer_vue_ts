import { AxiosResponse as BaseAxiosResponse } from 'axios'

declare module 'axios' {
  export interface AxiosResponse<T = any, D = any> extends BaseAxiosResponse {
    data: T
    code: number
    msg: string
    records: T
    total: number
  }
}
