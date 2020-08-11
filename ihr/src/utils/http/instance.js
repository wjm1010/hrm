// axios 的配置文件
import Qs from 'qs'
const config = {
  baseURL: process.env.NODE_ENV === 'production' ? window.location.origin.replace(/(hrm-temp|hrm)/, 'hrmapi') : process.env.BASE_API, // api的base_url
  transformRequest: [(data) => {
    return Qs.stringify(data)
  }],
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
}
export default config
