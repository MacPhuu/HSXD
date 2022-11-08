import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "querystring"

const groupAPI = {
  get(params = {}) {
    const url = params ? `${config.api.auth}/group?${queryString.stringify(params)}` : `${config.api.auth}/group`

    return request({
      url,
      method: 'get'
    })
  },
  create(data) {
    return request({
      url: `${config.api.auth}/group`,
      method: 'post',
      data
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.auth}/group/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.auth}/group/${id}`,
      method: 'delete'
    })
  }
}

export default groupAPI
