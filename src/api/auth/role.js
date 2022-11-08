import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "querystring"

const roleAPI = {
  get(params = {}) {
    const url = params ? `${config.api.auth}/role?${queryString.stringify(params)}` : `${config.api.auth}/role`

    return request({
      url,
      method: 'get'
    })
  },
  create(data) {
    return request({
      url: `${config.api.auth}/role`,
      method: 'post',
      data
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.auth}/role/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.auth}/role/${id}`,
      method: 'delete'
    })
  }
}

export default roleAPI
