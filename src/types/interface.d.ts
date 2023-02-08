declare interface RServerData {
  code: string
  msg: string
  data: any
}
declare interface PServerData {
  code: string
  records: any
  total: number
}
declare interface SecurityJsCode {
  securityJsCode: string
}
declare interface Window {
  _AMapSecurityConfig: SecurityJsCode
}
