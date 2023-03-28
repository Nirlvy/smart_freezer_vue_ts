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
  SCOPE?: scope[]
}

type deviceInfos = {
  data: deviceInfo[]
  hasNext: boolean
  totalElements: number
  totalPages: number
}

type complexly = {
  id: {
    entityType: string
    id: string
  }
  tenantId: {
    entityType: string
    id: string
  }
  customerId: null
  salesTime: number
  sale: {
    [key: string]: string
  }
  deviceId: string
  openTime: number
  closeTime: number
  purchaseImage: string | null
  displayImage: string | null
  purity: null
  productName?: string
}

type complexlyPage = {
  data: complexly[]
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

type sortProperty = {
  createdTime
  customerTitle
  deviceProfileName
  label
  name
  closeTime
  openTime
  salesTime
}

type sortOrder = {
  ASC
  DESC
}

type scope = {
  lastUpdateTs: number
  key: string
  value: number | boolean
}

type commodity = {
  id: {
    entityType: string
    id: string
  }
  createdTime: number
  additionalInfo: null
  name: string
  image: null
  commodityIndex: string
  feature: null
  groupId: string
  barCode: string
  brand: string
  type: string
  market: string
  mdVer: string
}

type chart =
  | {
      'base.core.popu.cnt': Array<{ ts: number; value: string }>
    }
  | {
      'base.core.door.cnt': Array<{ ts: number; value: string }>
    }
  | {
      'base.core.frhCtrl.temp.val': Array<{ ts: number; value: string }>
    }
  | {
      'base.core.power.u': Array<{ ts: number; value: string }>
    }

type deviceProfile = {
  id: {
    entityType: string
    id: string
  }
  createdTime: number
  tenantId: {
    entityType: string
    id: string
  }
  name: string
  description: string
  image: null
  type: string
  transportType: string
  provisionType: string
  defaultRuleChainId: {
    entityType: string
    id: string
  }
  defaultDashboardId: null
  defaultQueueName: string
  profileData: {
    configuration: {
      type: string
    }
    transportConfiguration: {
      type: string
    }
    provisionConfiguration: {
      type: string
      provisionDeviceSecret: string
    }
    alarms: []
  }
  provisionDeviceKey: string
  firmwareId: null
  softwareId: null
  modelwareId: null
  featurewareId: null
  pfwareId: {
    entityType: string
    id: string
  }
  default: boolean
}
