import { transformRequest, transformResponse } from './helpers/data'
import { processHeaders } from './helpers/header'
import { AxiosRequestConfig, Method } from './types'

const defaultConfig: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  transformRequest: [
    function(data: any, headers?: any) {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    function(data: any) {
      return transformResponse(data)
    }
  ]
}

const methodsNoData: Method[] = ['get', 'head', 'options', 'delete']
const methodsWithData: Method[] = ['put', 'patch', 'post']

methodsNoData.forEach(method => {
  defaultConfig.headers[method] = {}
})

methodsWithData.forEach(method => {
  defaultConfig.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaultConfig
