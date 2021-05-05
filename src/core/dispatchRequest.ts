import { AxiosPromise, AxiosResponse } from '../types'
import { transformData, transformRequest } from '../helpers/data'
import { processHeaders } from '../helpers/header'
import { buildURL } from '../helpers/url'
import { AxiosRequestConfig } from '../types'
import xhr from './xhr'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then((value: AxiosResponse) => transformResponseData(value))
}

function processConfig(config: AxiosRequestConfig) {
  config.url = transformUrl(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
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

export default dispatchRequest
