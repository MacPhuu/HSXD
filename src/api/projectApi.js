import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const ProjectAPI = {
  create(data) {
    return request({
      url: `${config.api.project}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.project}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  update(data) {
    return request({
      url: `${config.api.project}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.project}/${id}`,
      method: 'delete'
    })
  },
  getPhaseAndFile(params) {
    return request({
      url: `${config.api.project}/getAll?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  loginStep1(data) {
    return request({
      url: `${config.api.base}/open/project/loginStep1`,
      method: 'post',
      data
    })
  },
  loginStep2(data) {
    return request({
      url: `${config.api.base}/open/project/loginStep2`,
      method: 'post',
      data
    })
  },
  getProjectOfBidding(biddingProjectId) {
    return request({
      url: `${config.api.project}/bidding?biddingProjectId=${biddingProjectId}`,
      method: 'get',
    })
  },
  createProject(data) {
    return request({
      url: `${config.api.project}/bidding`,
      method: 'post',
      data
    })
  },
  updateProject(id, data) {
    return request({
      url: `${config.api.project}/bidding/${id}`,
      method: 'put',
      data
    })
  },
  deleteProject(id) {
    return request({
      url: `${config.api.project}/bidding/${id}`,
      method: 'delete',
    })
  }
}
export default ProjectAPI
