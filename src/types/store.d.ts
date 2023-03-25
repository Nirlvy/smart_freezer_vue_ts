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
