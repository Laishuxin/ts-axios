import { AxiosPromise, AxiosResponse } from '../types'
import { flattenHeader } from '../helpers/header'
import { buildURL } from '../helpers/url'
import { AxiosRequestConfig } from '../types'
import xhr from './xhr'
import transform from './transform'
import { combineURL, isAbsoluteURL } from '../helpers/utils'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then((value: AxiosResponse) => transformResponseData(value))
}

function processConfig(config: AxiosRequestConfig) {
  config.url = transformUrl(config)
  // config.headers = transformHeaders(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeader(config.headers, config.method!)
}

export function transformUrl(config: AxiosRequestConfig): string {
  const { params, paramsSerializer, baseURL } = config
  let url = config.url
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }

  return buildURL(url!, params, paramsSerializer)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}

export default dispatchRequest
