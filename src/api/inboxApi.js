import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const InboxApi = {
  get(params = {}) {
    return request({
      url: `${config.api.inbox}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getCount() {
    return request({
      url: `${config.api.inbox}/count`,
      method: 'get'
    })
  }
}
export default InboxApi
