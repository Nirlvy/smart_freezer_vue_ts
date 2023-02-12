declare interface RServerData {
  code: number
  msg: string
  data: any
}
declare interface PServerData {
  records: any
  total: number
}
declare interface SecurityJsCode {
  securityJsCode: string
}
declare interface Window {
  _AMapSecurityConfig: SecurityJsCode
}
