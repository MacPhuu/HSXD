import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const MemberAPI = {
  create(data) {
    return request({
      url: `${config.api.member}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.member}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.member}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.member}/${id}`,
      method: 'delete'
    })
  }
}
export default MemberAPI
