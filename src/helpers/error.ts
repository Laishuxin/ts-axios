import { AxiosError as AError, AxiosRequestConfig, AxiosResponse } from '../types/'

export class AxiosError extends Error implements AError {
  config: AxiosRequestConfig
  code?: string | number | null | undefined
  request?: XMLHttpRequest | undefined
  response?: AxiosResponse | undefined
  isAxiosError: boolean

  constructor(
    message: string,
    config: AxiosRequestConfig,
    request?: XMLHttpRequest,
    code?: string | null | undefined,
    response?: AxiosResponse
  ) {
    super(message)
    this.config = config
    this.request = request
    this.response = response
    this.code = code
    this.isAxiosError = true
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

export function createError(
  message: string,
  config: AxiosRequestConfig,
  request?: XMLHttpRequest,
  code?: string | null | undefined,
  response?: AxiosResponse
): AxiosError {
  return new AxiosError(message, config, request, code, response)
}
