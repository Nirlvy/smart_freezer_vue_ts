import request2 from './request2'

const format = (date) => {
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hour = ('0' + date.getHours()).slice(-2)
  const minute = ('0' + date.getMinutes()).slice(-2)
  const second = ('0' + date.getSeconds()).slice(-2)
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export const month = (lastMonth: boolean) => {
  const currentDate = new Date()
  if (lastMonth) currentDate.setMonth(currentDate.getMonth() - 1)
  currentDate.setDate(1)
  currentDate.setHours(0)
  currentDate.setMinutes(0)
  currentDate.setSeconds(0)
  const firstDayTimestamp = currentDate.getTime()
  currentDate.setMonth(currentDate.getMonth() + 1)
  currentDate.setDate(1)
  const lastDayTimestamp = currentDate.getTime() - 1000
  const startDateTime = format(new Date(firstDayTimestamp))
  const endDateTime = format(new Date(lastDayTimestamp))
  return { startDateTime: startDateTime, endDateTime: endDateTime }
}

export const year = () => {
  const currentDate = new Date()
  const lastDayTimestamp = currentDate.getTime()
  currentDate.setMonth(1)
  currentDate.setDate(1)
  currentDate.setHours(0)
  currentDate.setMinutes(0)
  currentDate.setSeconds(0)
  const firstDayTimestamp = currentDate.getTime()
  const startDateTime = format(new Date(firstDayTimestamp))
  const endDateTime = format(new Date(lastDayTimestamp))
  return { startDateTime: startDateTime, endDateTime: endDateTime }
}

export const outlets = async (
  pageNum: number,
  pageSize: number,
  sort?: 'Desc' | 'Asc',
  sortType?: 'Total Price' | 'DeviceAvg',
  startTime?: string,
  endTime?: string
) => {
  const url =
    '/log/outletsPage?pageNum=' +
    pageNum +
    '&pageSize=' +
    pageSize +
    (sort ? '&sort=' + sort : '') +
    (sortType ? '&sortType=' + sortType : '') +
    (startTime ? '&startTime=' + startTime : '') +
    (endTime ? '&endTime=' + endTime : '')
  const res = await request2.get<R>(url)
  if (res.data.code != 200) return
  return res.data.data
}

export const uploadOrSoldDays = async (choose: 'month' | 'year', upOrSold: boolean | null) => {
  const url = '/log/uploadOrSoldDays?choose=' + choose + (upOrSold != null ? '&upOrSold=' + upOrSold : '')
  const res = await request2.get<R>(url)
  if (res.data.code != 200) return
  return res.data.data
}

export const soldValue = async (choose: 'month' | 'year') => {
  const url = '/log/soldValue?choose=' + choose
  const res = await request2.get<R>(url)
  if (res.data.code != 200) return
  return res.data.data
}

export const productPage = async (choose: 'month' | 'year') => {
  const time = choose === 'month' ? month(false) : year()
  const url = '/log/productPage?pageNum=1&pageSize=10000&startTime=' + time.startDateTime + '&endTime=' + time.endDateTime
  const res = await request2.get(url)
  if (res.data.code != 200) return
  res.data.data.length = res.data.data.length - 1
  return res.data.data.map((item) => ({ value: item.Count, name: item.Type }))
}

export const productUpdate = async (type: string) => {
  if (type != '美汁源果粒橙百香果+柠檬') return
  const product = {
    priceOrCount: false,
    num: -1,
    type: type,
    device: 'HB15154',
  }
  request2.post('/product/update', product)
}
