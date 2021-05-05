const toString = Object.prototype.toString

// export function isObject(val: any): val is Object {
//   return val !== null && typeof val !== 'object'
// }

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isArray(val: any): val is Array<any> {
  return Array.isArray(val)
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as any)[key] = from[key]
  }
  return to as any
}
