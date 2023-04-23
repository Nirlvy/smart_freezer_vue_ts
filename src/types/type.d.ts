type SecurityJsCode = {
  securityJsCode: string
}

type Window = {
  _AMapSecurityConfig: SecurityJsCode
}

type Option = {
  value: string
  label: string
  children?: Option[]
}
