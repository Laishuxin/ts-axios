import { InterceptorManager as InterceptorManagerInterface, RejectedFn, ResolvedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export class InterceptorManager<T> implements InterceptorManagerInterface<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      //! NOTE: lazy delete.
      this.interceptors[id] = null
    }
  }

  /**
   * Traverse interceptors by indicating callback
   * @param fn callback
   */
  forEach(fn: (interceptor: Interceptor<T>) => void) {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) fn(interceptor)
    })
  }
}
