import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const phaseAPI = {
  create(data) {
    return request({
      url: `${config.api.phase}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.phase}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.phase}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.folder}/${id}`,
      method: 'delete'
    })
  }
}
export default phaseAPI
