import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import { parseHeader } from '../helpers/header'
import { createError } from '../helpers/error'

/**
 * Send XMLHttpRequest.
 * @param config Axios request configuration.
 */
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'GET', headers, responseType, timeout } = config
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url as string, true)
    if (timeout) request.timeout = timeout

    if (headers) {
      Object.keys(headers).forEach(name => {
        const headerValue: string = headers[name]
        if (data === null && headerValue.toUpperCase() === 'CONTENT-TYPE') {
          delete headers[name]
        }
        request.setRequestHeader(name, headerValue)
      })
    }

    request.send(data)

    request.onreadystatechange = function() {
      if (request.readyState !== 4) {
        return
      }
      const status = request.status

      const headers = request.getAllResponseHeaders()
      const data = responseType && responseType !== 'text' ? request.response : request.responseText

      const response: AxiosResponse = {
        headers: parseHeader(headers),
        data,
        status,
        statusText: request.statusText,
        request,
        config
      }

      if (status === 0) {
        return
      } else if (status >= 200 && status < 300) {
        resolve(response)
      } else {
        reject(
          createError(`Request failed with status code ${status}`, config, request, null, response)
        )
      }
    }

    // Network error
    request.onerror = function() {
      reject(createError('Network error', config, request, null))
    }

    // timeout
    request.ontimeout = function() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, request, 'TIMEOUT'))
    }
  })
}
