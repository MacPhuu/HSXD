import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const FileAPI = {
  sendMail(id) {
    return request({
      url: `${config.api.file}/sendMail?id=${id}`,
      method: 'get',
    })
  },
  addFile(data) {
    return request({
      url: `${config.api.file}/addFile`,
      method: 'put',
      data
    })
  },
  updateTag(id, ids) {
    return request({
      url: `${config.api.file}/updatetag/${id}`,
      method: 'put',
      data: {
        tags: ids
      }
    })
  },
  create(data) {
    return request({
      url: `${config.api.file}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.file}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.file}/${id}`,
      method: 'get'
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.file}/${id}`,
      method: 'put',
      data
    })
  },
  move(id, data) {
    return request({
      url: `${config.api.file}/move/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.file}/${id}`,
      method: 'delete'
    })
  },
  digitizing(id) {
    return request({
      url: `${config.api.file}/digital?id=${id}`,
      method: 'get'
    })
  },
  getStatusDigital(id) {
    return request({
      url: `${config.api.file}/status?id=${id}`,
      method: 'get'
    })
  }
}
export default FileAPI
