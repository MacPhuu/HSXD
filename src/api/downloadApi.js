import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'query-string'

const DownloadAPI = {
  get(data) {
    return request({
      url: `${config.api.downloadMultiFile}/folder/download`,
      method: 'get',
      params: data,
      responseType: 'blob'
    })
  }
}
export default DownloadAPI
