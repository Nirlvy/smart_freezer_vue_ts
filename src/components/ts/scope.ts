const getEntityFilter = (mode: 'websocket' | 'http') => {
  if (mode === 'websocket') {
    return {
      entityFilter: {
        type: 'entityType',
        resolveMultiple: true,
        entityType: 'DEVICE',
      },
    }
  } else {
    return {
      entityFilter: {
        type: 'entityType',
        entityType: 'DEVICE',
      },
    }
  }
}

const typeChoose = (
  type: '在线设备' | '离线设备' | '启用设备' | '停用设备' | '投放设备' | '在库设备' | '在店设备' | 'IMEI' | '通电设备' | '断电设备',
  search?: string
) => {
  switch (type) {
    case '在线设备':
      return [
        {
          key: {
            type: 'SERVER_ATTRIBUTE',
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
    case '离线设备':
      return [
        {
          key: {
            type: 'SERVER_ATTRIBUTE',
            key: 'active',
          },
          valueType: 'BOOLEAN',
          predicate: {
            operation: 'EQUAL',
            value: {
              defaultValue: false,
              dynamicValue: null,
            },
            type: 'BOOLEAN',
          },
        },
      ]
    case '启用设备':
      return [
        {
          key: {
            type: 'SHARED_ATTRIBUTE',
            key: 'enable',
          },
          valueType: 'BOOLEAN',
          predicate: {
            type: 'BOOLEAN',
            operation: 'EQUAL',
            value: { defaultValue: true },
          },
        },
      ]
    case '停用设备':
      return [
        {
          key: {
            type: 'SHARED_ATTRIBUTE',
            key: 'enable',
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
    case '投放设备':
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
    case '在库设备':
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
    case '在店设备':
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
    case '通电设备':
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
    case '断电设备':
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

export const getScopeParam = (
  mode: 'websocket' | 'http',
  attributes: '在线设备' | '离线设备' | '启用设备' | '停用设备' | '投放设备' | '在库设备' | '在店设备' | 'IMEI' | '通电设备' | '断电设备',
  search?: string
) => {
  return {
    ...getEntityFilter(mode),
    keyFilters: typeChoose(attributes, search),
  }
}
