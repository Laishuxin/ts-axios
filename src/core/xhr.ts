import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import { parseHeader } from '../helpers/header'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/utils'
import cookie from '../helpers/cookie'

/**
 * Send XMLHttpRequest.
 * @param config Axios request configuration.
 */
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'GET',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName
    } = config
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url!, true)
    if (timeout) request.timeout = timeout

    if (headers) {
      Object.keys(headers).forEach(name => {
        const headerValue: string = headers[name]
        if (data === null && headerValue.toLowerCase() === 'content-type') {
          delete headers[name]
        }
        request.setRequestHeader(name, headerValue)
      })
    }

    // set xsrf token
    debugger
    if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
      const xsrfValue = cookie.read(xsrfCookieName)
      if (xsrfValue && xsrfHeaderName) {
        request.setRequestHeader(xsrfHeaderName, xsrfValue)
      }
    }

    if (withCredentials) {
      request.withCredentials = withCredentials
    }

    request.send(data)

    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      })
    }

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
      reject(createError('ECONNABORTED', config, request, null))
    }

    // timeout
    request.ontimeout = function() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, request, 'TIMEOUT'))
    }
  })
}
