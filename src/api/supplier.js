import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const SupplierAPI = {
  create(data) {
    return request({
      url: `${config.api.supplier}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.supplier}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.supplier}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.supplier}/${id}`,
      method: 'delete'
    })
  }
}
export default SupplierAPI
