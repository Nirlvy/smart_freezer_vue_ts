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

type otaPackage = {
  devCat: 'lg,6,a'
  subCat: 'dlg,6,a'
  manu: '海信商用冷链有限公司,6,a'
  own: '上海申美饮料有限公司,6,b'
  servProv: '海信商用冷链有限公司,6,a'
  devVer: '1.0,6,a'
  catType: 'SC-393,6,b'
  devType: 'HX393,6,a'
  assID: '0,2,b'
  facCode: '0,2,b'
  act: '0,2,b'
  enable: '0,2,f'
  devSN: '0,0,a'
  ctrlVer: '0,0,a'
  lctrlVer: '0,0,a'
  imei: '0,0,a'
  onAlarmDelay: '0,2,3'
  'adv.ai': '0,0,a'
  base: {
    core: {
      frhCtrl: {
        group: '冷热控制,5,a'
        name: '工作模式,5,a'
        select: '0,2,0'
        type: '0,2,f'
        typeOpt: '1,5,0'
        mode: '0,2,f'
        modeOpt: '1,5,0'
        temp: {
          name: '柜内温度,5,a'
          addr: '301,2,3'
          set: '5,6,f'
          lowL: '0,6,3'
          upL: '10,6,3'
          val: '0,3,a'
          alarm: '0,3,a'
          lowA: '0,2,b'
          lowAD: '0,2,3'
          upA: '0,2,b'
          upAD: '0,2,3'
        }
        temp2: {
          name: '蒸发器温度,5,a'
          addr: '302,2,3'
          val: '0,3,a'
          lowP: '0,2,3'
        }
        temp3: {
          name: '冷凝器温度,5,a'
          addr: '303,2,3'
          val: '0,3,a'
          aDT: '0,2,3'
          upAT: '0,2,3'
        }
        temp4: {
          name: '环境温度,5,a'
          addr: '304,2,3'
          val: '0,3,a'
          alarm: '0,3,a'
        }
        comp: {
          name: '制冷压缩机,5,a'
          group: '制冷制热,5,a'
          addr: '001,2,3'
          ctrl: '0,2,f'
          switch: '0,2,f'
          stat: '0,3,a'
          delay: '0,2,3'
          minT: '0,2,3'
          maxT: '0,2,3'
          minST: '0,2,3'
          fcT: '0,2,3'
          sert: '0,2,3'
          sest: '0,2,3'
        }
        fan: {
          group: '风机,5,a'
          name: '风机,5,a'
          Mode: '0,2,3'
          val: '0,3,a'
          eVal: '0,3,a'
          bVal: '0,3,a'
          sumT: '0,3,a'
          ctrlP: '0,2,3'
          eCtrlP: '0,2,3'
          bCtrlP: '0,2,3'
          Alarm: '0,3,a'
          evapAlarm: '0,3,a'
          banAlarm: '0,3,a'
          oT: '0,2,3'
          dT: '0,2,3'
          sT: '0,2,3'
        }
        heat: {
          dMode: '0,2,3'
          ctrl: '0,2,f'
          dHRT: '0,2,3'
          dHST: '0,2,3'
          bST: '0,2,3'
          aWT: '0,2,3'
        }
        hDefr: {
          ctrl: '0,2,f'
          time: '0,2,3'
          st1: '0,2,3'
          st2: '0,2,3'
          st3: '0,2,3'
          st4: '0,2,3'
          st5: '0,2,3'
          st6: '0,2,3'
          display: '0,2,3'
          Cyc: '0,2,3'
          dOT: '0,2,3'
          oNT: '0,2,3'
          aNT: '0,2,3'
        }
        revDefr: {
          group: '除霜,5,a'
          name: '逆转除霜,5,a'
          stat: '0,3,a'
        }
      }
      light: {
        frLight: {
          name: '冷柜照明,5,a'
          group: '灯光照明,5,a'
          addr: '002,2,3'
          switch: '0,2,f'
          state: '0,3,a'
        }
      }
      popu: {
        group: '人客流量,5,a'
        name: '人体感应传感器,5,a'
        cnt: '0,3,a'
      }
      door: {
        stat: '0,3,a'
        st: '0,3,a'
        end: '0,3,a'
        cnt: '0,3,a'
      }
      power: {
        name: '用电量,5,a'
        group: '用电统计,5,a'
        u: '0,3,a'
        i: '0,3,a'
        p: '0,3,a'
        e: '0,3,a'
      }
    }
    comm: {
      pos: {
        name: '位置传感器,5,a'
        group: '位置信息,5,a'
        lon: '0,3,a'
        lat: '0,3,a'
        pre: '0,3,a'
        dist: '0,3,a'
        addr: '0,3,a'
      }
      battery: {
        name: '续航电池,5,a'
        group: '用电统计,5,a'
        stat: '0,3,a'
      }
    }
  }
  adv: {
    ai: {
      group: '高级功能,5,a'
      name: '产品识别,5,a'
      stat: '1,2,b'
      pure: '0,3,a'
      image: '0,3,a'
      sale: '0,3,a'
      sImage: '0,3,a'
      saleResult: '0,3,a'
    }
  }
}
