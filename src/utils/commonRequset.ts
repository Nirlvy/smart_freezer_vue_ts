import { ElMessage } from 'element-plus'
import request from './request'

export const requestPage = async (
  pageSize: number,
  currentPage: number,
  name: boolean,
  textSearch?: string,
  type?: string,
  deviceProfileId?: string,
  sortProperty?: sortProperty,
  sortOrder?: sortOrder
) => {
  const url =
    '/tenant/deviceInfos' +
    (name ? '/deviceName' : '') +
    '?pageSize=' +
    pageSize +
    '&page=' +
    (currentPage - 1) +
    (type ? '&type=' + type : '') +
    (deviceProfileId ? '&deviceProfileId=' + deviceProfileId : '') +
    (textSearch ? '&textSearch=' + textSearch : '') +
    (sortProperty ? '&sortProperty=' + sortProperty : '&sortProperty=createdTime') +
    (sortOrder ? '&sortOrder=' + sortOrder : '&sortOrder=DESC')
  const res = await request.get<deviceInfos & E>(url)
  if (res.data.status) {
    return
  }
  return res.data
}

export const getDeviceInfo = async (deviceId: string) => {
  const res = await request.get<deviceInfo & E>('/device/info/' + deviceId)
  if (res.data.status) {
    return
  }
  return res.data
}

export const getDevicesInfo = async (deviceIds: string[]) => {
  const str = deviceIds.join(',')
  const url = 'devices?deviceIds=' + str
  const res = await request.get<deviceInfo[] & E>(url)
  if (res.data.status) {
    return
  }
  return res.data
}

export const getScope = async (device: string, mode: 'page' | 'device' | 'info') => {
  const param = {
    page: ['enable,act', 'check,out,assign,active', 'imei'],
    device: [
      '',
      'base.core.frhCtrl.group,base.core.frhCtrl.name,base.core.frhCtrl.typeOpt,base.core.frhCtrl.modeOpt,base.core.frhCtrl.temp.name,base.core.frhCtrl.temp2.name,base.core.frhCtrl.temp3.name,base.core.frhCtrl.temp4.name,base.core.frhCtrl.comp.name,base.core.frhCtrl.comp.group,base.core.frhCtrl.fan.group,base.core.frhCtrl.fan.name,base.core.frhCtrl.revDefr.group,base.core.frhCtrl.revDefr.name,base.core.light.frLight.name,base.core.light.frLight.group,base.core.popu.group,base.core.popu.name,base.core.power.name,base.core.power.group,base.comm.pos.name,base.comm.pos.group,base.comm.battery.name,base.comm.battery.group,adv.ai.group,adv.ai.name',
      'assID,devSN,ctrlVer,lctrlVer,imei',
    ],
    info: ['', '', ''],
  }
  const keys = '/SHARED_SCOPE?keys=' + param[mode][0]
  const keys2 = '/SERVER_SCOPE?keys=' + param[mode][1]
  const keys3 = '/CLIENT_SCOPE?keys=' + param[mode][2]
  const url = '/plugins/telemetry/DEVICE/' + device + '/values/attributes'
  const res1 = await request.get<scope[] & E>(url + keys)
  if (res1.data.status) {
    return
  }
  if (mode === 'info') {
    return res1.data
  }
  const res2 = await request.get<scope[] & E>(url + keys2)
  if (res2.data.status) {
    return
  }
  const res3 = await request.get<scope[] & E>(url + keys3)
  if (res3.data.status) {
    return
  }
  return res1.data.concat(res2.data).concat(res3.data)
}

export const devicesOperate = async (deviceIds: string, operate: 'export' | 'enable' | 'disable' | 'delete') => {
  const sharedEnable = { enable: 1 }
  const sharedDisabled = { enable: 0 }
  const serverEnable = {
    'base.core.frhCtrl.ID': 'R_Mode_001',
    'base.core.frhCtrl.name': '工作模式',
    'base.core.frhCtrl.group': '工作模式',
    'base.core.frhCtrl.comp.ID': 'RH_001',
    'base.core.frhCtrl.comp.name': '制冷压缩机',
    'base.core.frhCtrl.comp.group': '制冷制热',
    'base.core.frhCtrl.heat.ID': 'RH_002',
    'base.core.frhCtrl.heat.name': '制热加热器',
    'base.core.frhCtrl.heat.group': '制冷制热',
    'base.core.frhCtrl.compTemp.ID': 'T_compressor',
    'base.core.frhCtrl.compTemp.name': '压缩机温度',
    'base.core.frhCtrl.compTemp.group': '温度',
    'base.core.frhCtrl.temp.ID': 'T_compressor',
    'base.core.frhCtrl.temp.name': '冷柜柜内温度',
    'base.core.frhCtrl.temp.group': '温度',
    'base.core.frhCtrl.fan.ID': 'Fan_001',
    'base.core.frhCtrl.fan.name': '冷凝器风机',
    'base.core.frhCtrl.fan.group': '风机',
    'base.core.frhCtrl.hDefr.ID': 'RH_002',
    'base.core.frhCtrl.hDefr.name': '加热除霜',
    'base.core.frhCtrl.hDefr.group': '除霜',
    'base.core.frhCtrl.revDefr.ID': 'RH_002',
    'base.core.frhCtrl.revDefr.name': '逆转除霜',
    'base.core.frhCtrl.revDefr.group': '除霜',
    'base.core.light.frLight.ID': 'L0x0001',
    'base.core.light.frLight.name': '冷柜照明',
    'base.core.light.frLight.group': '灯光照明',
    'base.core.light.hLight.ID': 'L0x0002',
    'base.core.light.hLight.name': '热柜照明',
    'base.core.light.hLight.group': '灯光照明',
    'base.core.light.bxLight.ID': 'L0x0003',
    'base.core.light.bxLight.name': '灯箱照明',
    'base.core.light.bxLight.group': '灯光照明',
    'base.core.light.rdLight.ID': 'L0x0004',
    'base.core.light.rdLight.name': '圆盘灯',
    'base.core.light.rdLight.group': '灯光照明',
    'base.core.door.ID': 'D_01',
    'base.core.door.name': '柜门开闭',
    'base.core.door.group': '柜门开闭',
    'base.comm.pos.ID': 'P_001',
    'base.comm.pos.name': '位置传感器',
    'base.comm.pos.group': '位置信息',
    'base.core.popu.ID': 'M_001',
    'base.core.popu.name': '人体感应传感器',
    'base.core.popu.group': '人客流量',
    'base.core.power.ID': 'D_01',
    'base.core.power.name': '用电量',
    'base.core.power.group': '用电统计',
    'adv.ai.ID': 'PI_01',
    'adv.ai.name': '产品识别',
    'adv.ai.group': '高级功能',
  }
  return new Promise((resolve) => {
    switch (operate) {
      case 'export':
        request.get('/plugins/telemetry/devices/export/In_Bulk?deviceIds=' + deviceIds, {
          responseType: 'blob',
        })
        // TODO:导出
        break
      case 'enable':
        request.post('/plugins/telemetry/devices/' + deviceIds + '/SHARED_SCOPE', sharedEnable).then((res) => {
          if (res.data === true) {
            request.post('/plugins/telemetry/devices/' + deviceIds + '/SERVER_SCOPE', serverEnable).then((res) => {
              if (res.data === true) {
                ElMessage.success('激活成功')
                resolve(true)
              } else {
                ElMessage.success('激活失败')
                resolve(false)
              }
            })
          } else {
            ElMessage.success('激活失败')
            resolve(false)
          }
        })
        break
      case 'disable':
        request.post('/plugins/telemetry/devices/' + deviceIds + '/SHARED_SCOPE', sharedDisabled).then((res) => {
          if (res.data === true) {
            ElMessage.success('停用成功')
            resolve(true)
          } else {
            ElMessage.success('停用失败')
            resolve(false)
          }
        })
        break
      case 'delete':
        request.delete('/devices?deviceIds=' + deviceIds)
        resolve(true)
        break
    }
  })
}

export const find = async (
  pageSize: number,
  currentPage: number,
  type: 'Out' | 'Rep' | 'Shop' | 'IMEI' | 'PowerOn' | 'PowerOff',
  search?: string
) => {
  const typeChoose = (type: 'Out' | 'Rep' | 'Shop' | 'IMEI' | 'PowerOn' | 'PowerOff') => {
    switch (type) {
      case 'Out':
        return [
          {
            key: {
              type: 'ATTRIBUTE',
              key: 'out',
            },
            valueType: 'NUMERIC',
            predicate: {
              operation: 'EQUAL',
              value: {
                defaultValue: 1,
                dynamicValue: null,
              },
              type: 'NUMERIC',
            },
          },
        ]
      case 'Rep':
        return [
          {
            key: {
              type: 'ATTRIBUTE',
              key: 'assign',
            },
            valueType: 'NUMERIC',
            predicate: {
              operation: 'EQUAL',
              value: {
                defaultValue: 0,
                dynamicValue: null,
              },
              type: 'NUMERIC',
            },
          },
        ]
      case 'Shop':
        return [
          {
            key: {
              type: 'ATTRIBUTE',
              key: 'assign',
            },
            valueType: 'NUMERIC',
            predicate: {
              operation: 'EQUAL',
              value: {
                defaultValue: 1,
                dynamicValue: null,
              },
              type: 'NUMERIC',
            },
          },
        ]
      case 'IMEI':
        return [
          {
            key: {
              type: 'ATTRIBUTE',
              key: 'imei',
            },
            valueType: 'NUMERIC',
            predicate: {
              operation: 'EQUAL',
              value: {
                defaultValue: search,
                dynamicValue: null,
              },
              type: 'NUMERIC',
            },
          },
        ]
      case 'PowerOn':
        return [
          {
            key: {
              type: 'TIME_SERIES',
              key: 'base.comm.battery.stat',
            },
            valueType: 'NUMERIC',
            predicate: {
              operation: 'EQUAL',
              value: {
                defaultValue: 0,
                dynamicValue: null,
              },
              type: 'NUMERIC',
            },
          },
          {
            key: {
              type: 'ATTRIBUTE',
              key: 'active',
            },
            valueType: 'BOOLEAN',
            predicate: {
              operation: 'EQUAL',
              value: {
                defaultValue: true,
                dynamicValue: null,
              },
              type: 'BOOLEAN',
            },
          },
        ]
      case 'PowerOff':
        return [
          {
            key: {
              type: 'TIME_SERIES',
              key: 'base.comm.battery.stat',
            },
            valueType: 'NUMERIC',
            predicate: {
              operation: 'EQUAL',
              value: {
                defaultValue: 1,
                dynamicValue: null,
              },
              type: 'NUMERIC',
            },
          },
          {
            key: {
              type: 'ATTRIBUTE',
              key: 'active',
            },
            valueType: 'BOOLEAN',
            predicate: {
              operation: 'EQUAL',
              value: {
                defaultValue: true,
                dynamicValue: null,
              },
              type: 'BOOLEAN',
            },
          },
        ]
    }
  }
  const info = {
    entityFilter: {
      type: 'entityType',
      entityType: 'DEVICE',
    },
    keyFilters: typeChoose(type),
    pageLink: {
      page: currentPage,
      pageSize: pageSize,
      sortOrder: {
        property: 'createdTime',
        direction: 'DESC',
      },
    },
  }
  const res = await request.post<entitiesQueryFind & E>('/entitiesQuery/find', info)
  if (res.data.status) {
    return
  }
  return res.data
}

export const getComplexlyPage = async (
  page: {
    pageSize: number
    currentPage: number
  },
  input?: {
    name?: string
    number?: string
    time?: (string | number)[]
  },
  deviceId?: string,
  salesTime?: number,
  sortProperty?: sortProperty,
  sortOrder?: sortOrder
) => {
  const url =
    '/salesRecord/complexly' +
    '?pageSize=' +
    page.pageSize +
    '&page=' +
    (page.currentPage - 1) +
    (deviceId ? '&deviceId=' + deviceId : '') +
    (salesTime ? '&salesTime=' + salesTime : '') +
    (input
      ? input.name != '' && input.name
        ? '&textSearch=' + input.name + (input.time ? (input.time[0] != '' ? '&beginTime=' + input.time[0] + '&endTime=' + input.time[1] : '') : '')
        : ''
      : '') +
    (sortProperty ? '&sortProperty=' + sortProperty : '&sortProperty=closeTime') +
    (sortOrder ? '&sortOrder=' + sortOrder : '&sortOrder=DESC')
  const res = await request.get<complexlyPage & E>(url)
  if (res.data.status) {
    return
  }
  return res.data
}

export const getCommodityByIndex = async (index: number | string) => {
  const res = await request.get<commodity & E>('/commodity/by_index?index=' + index)
  if (res.data.status) {
    return
  }
  return res.data
}

// export const getCommodities = async (
//   page: {
//     pageSize: number
//     currentPage: number
//   },
//   input?: {
//     name: string
//   },
//   sortProperty?: sortProperty,
//   sortOrder?: sortOrder
// ) => {
//   const url = '/tenant/commodities' + '?pageSize=' + page.pageSize + '&page=' + (page.currentPage - 1)
// }

export const getDeviceCharts = async (deviceId: string, time: number[]) => {
  const param = ['base.core.popu.cnt', 'base.core.door.cnt', 'base.core.frhCtrl.temp.val', 'base.core.power.u']
  const url1 = '/plugins/telemetry/DEVICE/' + deviceId + '/values/timeseries?keys='
  const url2 = '&limit=100&agg=NONE&orderBy=DESC&useStrictDataTypes=false'
  const promises = param.map(async (item) => {
    const response = await request.get<chart & E>(url1 + item + '&startTs=' + time[0] + '&endTs=' + time[1] + url2)
    if (response.data.status) {
      return
    }
    return {
      [item]: response.data[item].reverse(),
    }
  })
  const res = await Promise.all(promises)
  return res
}

export const getTime = (time: number) => {
  const date = new Date(time)
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' : '') + date.getDate() + ' '
  const h = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':'
  const m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':'
  const s = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
  return Y + M + D + h + m + s
}

export const getDeviceProfile = async (deviceId: string) => {
  const url = '/deviceProfile/' + deviceId
  const res = await request.get<deviceProfile & E>(url)
  if (res.data.status) {
    return
  }
  return res.data
}

// export const getOtaPackage = async (pfwareId: string) => {
//   const url = '/otaPackage/' + pfwareId + '/download'
//   const res =await request.get
// }

export const modeSwitch = async (deviceId: string, value: number, mode: 'work' | 'run') => {
  const url = '/plugins/telemetry/DEVICE/' + deviceId + '/SHARED_SCOPE'
  const modeChoice = {
    work: { 'base.core.frhCtrl.mode': value },
    run: { 'base.core.frhCtrl.type': value },
  }
  const res = await request.post(url, modeChoice[mode])
  return res.data
}
