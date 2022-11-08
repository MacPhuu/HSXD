import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const CategoryAPI = {
  save(data) {
    return request({
      url: `${config.api.category}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.category}?${queryString.stringify(params)}`,
      method: 'get'
    })
  }
}
export default CategoryAPI
