import request from '@/utils/request'
import config from '@/utils/config'

const SignAPI = {
  sign(signRequestId, data) {
    return request({
      url: `${config.api.sign}/${signRequestId}`,
      method: 'post',
      data
    })
  },
  approve(signRequestId) {
    return request({
      url: `${config.api.sign}/approve/${signRequestId}`,
      method: 'post',
    })
  },
  reject(signRequestId) {
    return request({
      url: `${config.api.sign}/reject/${signRequestId}`,
      method: 'post'
    })
  },
  checkSign(signRequestId) {
    return request({
      url: `${config.api.sign}/canSign/${signRequestId}`,
      method: 'get'
    })
  }
}

export default SignAPI
