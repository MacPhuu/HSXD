import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const TagAPI = {
  create(data) {
    return request({
      url: `${config.api.tag}`,
      method: 'post',
      data
    })
  },
  createMany(data) {
    return request({
      url: `${config.api.tag}/many`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.tag}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getList(params = {}) {
    return request({
      url: `${config.api.tag}/list?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.tag}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.tag}/${id}`,
      method: 'delete'
    })
  }
}
export default TagAPI
