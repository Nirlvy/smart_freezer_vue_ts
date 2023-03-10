type E = {
  status: number
  message: string
  errorCode: number
  timestamp: string
  resetToken?: string
}

type LoginData = {
  token: string
  refreshToken: string
}

type deviceInfo = {
  id: {
    entityType: string
    id: string
  }
  createdTime: number
  additionalInfo: any
  tenantId: {
    entityType: string
    id: string
  }
  customerId: {
    entityType: string
    id: string
  }
  name: string
  type: string
  label: null
  deviceProfileId: {
    entityType: string
    id: string
  }
  deviceData: {
    configuration: {
      type: string
    }
    transportConfiguration: {
      type: string
    }
  }
  deviceName: null
  firmwareId: null
  softwareId: null
  modelwareId: null
  featurewareId: null
  pfwareId: null
  address: null
  longitude: null
  latitude: null
  templateDetails: null
  customerTitle: null
  customerIsPublic: boolean
  deviceProfileName: string
}

type deviceInfos = {
  data: deviceInfo[]
  hasNext: boolean
  totalElements: number
  totalPages: number
}

type entitiesQueryFind = {
  data: {
    entityId: {
      entityType: string
      id: string
    }
    latest: any
    timeseries: any
  }[]
  hasNext: boolean
  totalElements: number
  totalPages: number
}
