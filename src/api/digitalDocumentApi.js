import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const DigitalDocumentAPI = {
  create(data) {
    return request({
      url: `${config.api.digitalDocument}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.digitalDocument}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.digitalDocument}/${id}`,
      method: 'get'
    })
  },
  update(data) {
    return request({
      url: `${config.api.digitalDocument}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.digitalDocument}/${id}`,
      method: 'delete'
    })
  },
  checkRole(fileId) {
    return request({
      url: `${config.api.roleFolder}/checkdigital?fileId=${fileId}`,
      method: 'get'
    })
  }
}
export default DigitalDocumentAPI
