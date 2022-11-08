import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const ShareAPI = {
  getById(id, params = {}) {
    return request({
      url: `${config.api.roleFolder}/${id}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  checkRole(params = {}) {
    return request({
      url: `${config.api.roleFolder}/checkRole?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  updateMember(id, data, params = {}) {
    return request({
      url: `${config.api.roleFolder}/addrole/${id}?${queryString.stringify(params)}`,
      method: 'put',
      data
    })
  },
  updatePermission(id, data, params = {}) {
    return request({
      url: `${config.api.roleFolder}/updateper/${id}?${queryString.stringify(params)}`,
      method: 'put',
      data
    })
  },
  updateAndDeleteRoleFolder(id, data, params = {}) {
    return request({
      url: `${config.api.roleFolder}/updaterole/${id}?${queryString.stringify(params)}`,
      method: 'put',
      data
    })
  }
}
export default ShareAPI
