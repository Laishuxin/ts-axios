import dispatchRequest, { AxiosError } from '../../src/index'

dispatchRequest({
  method: 'get',
  url: '/error/get1',
})
  .then((res) => {
    console.log(res)
  })
  .catch((e) => {
    console.log(e)
  })

dispatchRequest({
  method: 'get',
  url: '/error/get',
})
  .then((res) => {
    console.log(res)
  })
  .catch((e) => {
    console.log(e)
  })

setTimeout(() => {
  dispatchRequest({
    method: 'get',
    url: '/error/get',
  })
    .then((res) => {
      console.log(res)
    })
    .catch((e) => {
      console.log(e)
    })
}, 5000)

dispatchRequest({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000,
})
  .then((res) => {
    console.log(res)
  })
  .catch((e) => {
    console.log(e.message)
  })

dispatchRequest({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000,
})
  .then((res) => {
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log(e.message)
    console.log(e.code)
    console.log(e.config)
  })
