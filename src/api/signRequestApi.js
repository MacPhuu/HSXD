import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const SignRequestAPI = {
  add(data) {
    return request({
      url: `${config.api.signRequest}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.signRequest}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  update(data) {
    return request({
      url: `${config.api.signRequest}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.signRequest}/${id}`,
      method: 'delete'
    })
  },
  signOnlyMe(data) {
    return request({
      url: `${config.api.signRequest}/onlyme`,
      method: 'post',
      data
    })
  }
}
export default SignRequestAPI
