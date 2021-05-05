import { Header } from '../types'
import { isObject } from './utils'

/**
 * Process http headers.
 * Including normalized headers and add some headers if necessary.
 * @param headers HTTP headers
 * @param data request payload
 * @returns headers
 */
export function processHeaders(headers: Header, data: any) {
  normalizedName(headers, 'Content-Type')
  if (isObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

function normalizedName(headers: Header, normalizedName: string) {
  if (!headers) return
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function parseHeader(headers: string): Header {
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
