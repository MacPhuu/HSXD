import request from '@/utils/request'
import config from '@/utils/config'

const UserAPI = {
  create(data) {
    return request({
      url: `${config.api.user}`,
      method: 'post',
      data
    })
  },
  getOTP(data) {
    return request({
      url: `${config.api.user}/sendotp`,
      method: 'put',
      data
    })
  },
  checkOTP(data) {
    return request({
      url: `${config.api.user}/checkotp`,
      method: 'put',
      data
    })
  },
  getById(id) {
    return request({
      url: `${config.api.user}/${id}`,
      method: 'get'
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.user}/${id}`,
      method: 'put',
      data
    })
  },
  getAll() {
    return request({
      url: `${config.api.user}?perPage=10000`,
      method: 'get',
    })
  },
  del(id) {
    return request({
      url: `${config.api.user}/${id}`,
      method: 'delete'
    })
  },
  loginStep1Bidding(data) {
    return request({
      url: `${config.api.user}/login/step1Bidding`,
      method: 'post',
      data
    })
  },
  loginStep2Bidding(data) {
    return request({
      url: `${config.api.user}/login/step2Bidding`,
      method: 'post',
      data
    })
  },
  loginStep1(data) {
    return request({
      url: `${config.api.user}/login/step1`,
      method: 'post',
      data
    })
  },
  loginStep2(data) {
    return request({
      url: `${config.api.user}/login/step2`,
      method: 'post',
      data
    })
  },
  changePassword(data) {
    return request({
      url: `${config.api.user}/changePassword`,
      method: 'put',
      data
    })
  },
  refreshToken() {
    return request({
      url: `${config.api.user}/refreshToken`,
      method: 'get'
    })
  }
}

export default UserAPI
