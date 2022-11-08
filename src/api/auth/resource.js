import request from '@/utils/request'
import config from '@/utils/config'
import queryString from 'querystring'

const resoureAPI = {
  get(params = {}) {
    const url = params ? `${config.api.auth}/resource?${queryString.stringify(params)}` : `${config.api.auth}/resource`

    return request({
      url,
      method: 'get'
    })
  },
  create(data) {
    return request({
      url: `${config.api.auth}/resource`,
      method: 'post',
      data
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.auth}/resource/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.auth}/resource/${id}`,
      method: 'delete'
    })
  }
}

export default resoureAPI
