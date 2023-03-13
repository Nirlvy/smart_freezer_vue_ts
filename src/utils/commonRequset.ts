import request from './request'

export const requestPage = async (pageSize: number, currentPage: number) => {
  const res = await request.get<deviceInfos & E>(
    '/tenant/deviceInfos?pageSize=' + pageSize + '&page=' + currentPage
  )
  if (res.data.status) {
    return
  }
  return res.data
}
