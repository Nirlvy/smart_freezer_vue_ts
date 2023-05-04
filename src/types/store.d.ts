type Login = {
  token: string
  refreshToken: string
}

type JWT = {
  sub: string
  scopes: string[]
  userId: string
  enabled: boolean
  isPublic: boolean
  tenantId: string
  customerId: string
  iss: string
  iat: number
  exp: number
}

type USER = {
  id: {
    id: string
    entityType: string
  }
  createdTime: number
  tenantId: {
    id: string
    entityType: string
  }
  customerId: {
    id: string
    entityType: string
  }
  email: string
  name: string
  authority: string
  firstName: string
  lastName: string
  additionalInfo: any
}

type FreezerValue = {
  name: string
  value: number
}

type id2Item = {
  [key: string]: string
}

type scopes = '全部设备' | '在线设备' | '投放设备' | '启用设备' | '通电设备' | '在库设备' | '在店设备' | 'IMEI' | '离线设备' | '停用设备' | '断电设备'
