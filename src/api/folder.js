import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const FolderAPI = {
  create(data) {
    return request({
      url: `${config.api.folder}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.folder}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.folder}/${id}`,
      method: 'get'
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.folder}/${id}`,
      method: 'put',
      data
    })
  },
  move(id, data) {
    return request({
      url: `${config.api.folder}/move/${id}`,
      method: 'put',
      data
    })
  },
  updateTag(id, ids) {
    return request({
      url: `${config.api.folder}/updatetag/${id}`,
      method: 'put',
      data: {
        tags: ids
      }
    })
  },
  delete(id) {
    return request({
      url: `${config.api.folder}/${id}`,
      method: 'delete'
    })
  },
  getFileAndFolder(params) {
    return request({
      url: `${config.api.fileAndFolder}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getTreeFolder() {
    return request({
      url: `${config.api.folder}/getTree`,
      method: 'get'
    })
  }
}
export default FolderAPI
