import { Method } from '../types'
import { deepMerge, isPlainObject } from './utils'

/**
 * Process http headers.
 * Including normalized headers and add some headers if necessary.
 * @param headers HTTP headers
 * @param data request payload
 * @returns headers
 */
export function processHeaders(headers: any, data: any) {
  normalizedName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

function normalizedName(headers: any, normalizedName: string) {
  if (!headers) return
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function parseHeader(headers: string): any {
  const res = Object.create(null)
  if (!headers) return res

  headers.split('\r\n').forEach(header => {
    let [key, value] = header.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }

    if (value) {
      value = value.trim()
    }

    res[key] = value
  })
  return res
}

/**
 * Flattens headers
 * @param headers Http headers
 * @param method  Http method
 * @example
 * headers: {
 *  common: {
 *    Accept: 'application/json, text/plain, *\/*'
 *  },
 *  post: {
 *    'Content-Type':'application/x-www-form-urlencoded'
 *  }
 *}
 * // result:
 * headers: {
 * Accept: 'application/json, text/plain, *\/*',
 *'Content-Type':'application/x-www-form-urlencoded'
 * }
 */
export function flattenHeader(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }

  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)
  const fieldsToDelete = ['common', 'get', 'head', 'options', 'delete', 'put', 'patch', 'post']
  fieldsToDelete.forEach(field => {
    delete headers[field]
  })
  return headers
}
