import axios from '../../src/axios'
import { Canceler } from '../../src/types'

const CancelToken = axios.CancelToken
let cancel: Canceler
const source = CancelToken.source()

// axios
//   .get('/cancel/token', {
//     cancelToken: new CancelToken((c) => {
//       cancel = c
//     }),
//   })
//   .catch(function (e) {
//     console.log(e)
//   })

// setTimeout(() => {
//   // cancel('Operation canceled by the user')
// }, 1000)


// axios
//   .get('/cancel/token', {
//     cancelToken: source.token,
//   })
//   .then(
//     (val) => {
//       console.log('cancel2 token val: ', val)
//     },
//     (reason) => {
//       if (axios.isCancel(reason)) {
//         console.log('cancel token reason: ', reason.message)
//       }
//     }
//   )

// source.cancel('Operation canceled by the user2.')

axios
  .get('/cancel/token', {
    cancelToken: source.token,
  })
  .catch(function (e) {
    if (axios.isCancel(e)) {
      console.log(`请求取消原因：${e.message}`)
    }
  })

setTimeout(() => {
  source.cancel('Operation canceled by the user')
}, 1000)

setTimeout(() => {
  axios
    .get('/cancel/token', {
      cancelToken: source.token,
    })
    .catch(function (e) {
      if (axios.isCancel(e)) {
        console.log(`请求取消原因：${e.message}`)
      }
    })
}, 1500)
