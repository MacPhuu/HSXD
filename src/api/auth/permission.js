import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "querystring"

const permissionAPI = {

  get(params = {}) {
    const url = params ? `${config.api.auth}/permission?${queryString.stringify(params)}` : `${config.api.auth}/permission`

    return request({
      url,
      method: 'get'
    })
  },
  create(data) {
    return request({
      url: `${config.api.auth}/permission`,
      method: 'post',
      data
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.auth}/permission/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.auth}/permission/${id}`,
      method: 'delete'
    })
  }
}

export default permissionAPI
