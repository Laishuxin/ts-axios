import { AxiosPromise, AxiosResponse } from '../types'
import { transformData, transformRequest } from '../helpers/data'
import { processHeaders } from '../helpers/header'
import { buildURL } from '../helpers/url'
import { AxiosRequestConfig } from '../types'
import xhr from './xhr'

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(
    (value: AxiosResponse) => transformResponseData(value)
    // err => err
  )
}

function processConfig(config: AxiosRequestConfig) {
  config.url = transformUrl(config)
  config.data = transformRequestData(config)
  config.headers = transformHeaders(config)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url as string, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  const { data } = config
  return transformRequest(data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformData(res.data)
  return res
}

export default axios
