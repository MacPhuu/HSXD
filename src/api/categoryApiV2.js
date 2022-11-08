import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const CategoryAPIV2 = {
  save(data) {
    return request({
      url: `${config.api.categoryV2}`,
      method: 'post',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.categoryV2}/${id}`,
      method: 'delete'
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.categoryV2}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.categoryV2}/detail/${id}`,
      method: 'get'
    })
  },
  getByIdv2(id) {
    return request({
      url: `${config.api.categoryV2}/${id}`,
      method: 'get'
    })
  },
  getChildById(id) {
    return request({
      url: `${config.api.categoryDetail}/${id}`,
      method: 'get'
    })
  },
  addRecord(id, data) {
    return request({
      url: `${config.api.categoryDetail}/add/${id}`,
      method: 'put',
      data
    })
  },
  editCategory(id, data) {
    return request({
      url: `${config.api.categoryV2}/${id}`,
      method: 'put',
      data
    })
  },
  updateRecord(id, recordId, data) {
    return request({
      url: `${config.api.categoryDetail}/update/${id}/${recordId}`,
      method: 'put',
      data
    })
  },
  deleteRecord(id, recordId) {
    return request({
      url: `${config.api.categoryDetail}/delete/${id}/${recordId}`,
      method: 'put'
    })
  },
  updateHeader(id, data) {
    return request({
      url: `${config.api.categoryDetail}/header/${id}`,
      method: 'put',
      data
    })
  }
}
export default CategoryAPIV2
