import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import { parseHeader, processHeaders } from '../helpers/header'
import { createError } from '../helpers/error'
import { isFormData, isURLSameOrigin } from '../helpers/utils'
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
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url!, true)
    configureRequest()
    addEvents()
    processHeaders()
    processCancel()
    request.send(data)

    function configureRequest() {
      if (responseType) {
        request.responseType = responseType
      }
      if (timeout) request.timeout = timeout

      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }
    function addEvents() {
      request.onreadystatechange = function() {
        if (request.readyState !== 4) {
          return
        }
        const status = request.status

        const headers = request.getAllResponseHeaders()
        const data =
          responseType && responseType !== 'text' ? request.response : request.responseText

        const response: AxiosResponse = {
          headers: parseHeader(headers),
          data,
          status,
          statusText: request.statusText,
          request,
          config
        }
        handleResponse(response)
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      // Network error
      request.onerror = function() {
        reject(createError('ECONNABORTED', config, request, null))
      }

      // timeout
      request.ontimeout = function() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, request, 'TIMEOUT'))
      }
    }
    function processHeaders() {
      // set xsrf token
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          request.setRequestHeader(xsrfHeaderName, xsrfValue)
        }
      }

      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      if (headers) {
        Object.keys(headers).forEach(name => {
          const headerValue: string = headers[name]
          if (data === null && headerValue.toLowerCase() === 'content-type') {
            delete headers[name]
          }
          request.setRequestHeader(name, headerValue)
        })
      }

      if (isFormData(data)) {
        delete headers['Content-Type']
      }
    }

    function processCancel() {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    function handleResponse(response: AxiosResponse) {
      const status = response.status
      if (!validateStatus || validateStatus(status)) {
        resolve(response)
      } else {
        reject(
          createError(`Request failed with status code ${status}`, config, request, null, response)
        )
      }
    }
  })
}
