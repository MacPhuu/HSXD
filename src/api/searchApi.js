import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const searchAPI = {
  getAll(params = {}) {
    return request({
      url: `${config.api.search}/file?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getByTag(params = {}) {
    return request({
      url: `${config.api.search}/tag?${queryString.stringify(params)}`,
      method: 'get'
    })
  }
}
export default searchAPI
