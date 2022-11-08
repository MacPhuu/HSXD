import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const UserProjectAPI = {
  get(params = {}) {
    return request({
      url: `${config.api.userProject}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  update(data) {
    return request({
      url: `${config.api.userProject}`,
      method: 'put',
      data
    })
  },
}
export default UserProjectAPI
