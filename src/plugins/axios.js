import axios from 'axios'
import { useUserStore } from '@/store/user'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API
})

export const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API
})

// 1. 呼叫 axios.get axios.post 時
// 2. interceptors.request 請求攔截器
// 3. 送出請求
// 4. interceptors.response 回應攔截器
// 5. 呼叫 axios 的 .then() catch()
apiAuth.interceptors.request.use(config => {
  const user = useUserStore()
  config.headers.authorization = 'Bearer ' + user.token
  return config
})

// 1. getProfile
// 2. 如果發生登入逾時錯誤
// 3. 傳送舊換新請求
// 4. 如果舊換新成功，修改 getProfile 請求的 jwt 後重新送出
// 5. 如果舊換新失敗，將 getProfile 的錯誤回傳
// 6. 如果不是登入逾時錯誤，將 getProfile 的錯誤回傳
// axios.interceptors.response.use(成功執行的 function, 失敗執行的 function)
apiAuth.interceptors.response.use(res => {
  return res
}, error => {
  // 如果有收到回應
  if (error.response) {
    // 如果是 JWT 過期的錯誤，且不是舊換新請求
    if (error.response.data.message === '登入逾時' && error.config.url !== '/users/extend') {
      const user = useUserStore()
      // 傳送 JWT 舊換新請求
      return apiAuth.patch('/users/extend')
        .then(({ data }) => {
          // 如果舊換新成功，更新 user store 的 JWT
          user.token = data.result
          // 修改原發生錯誤的請求的 JWT
          error.config.headers.authorization = 'Bearer ' + user.token
          // 重新傳送原請求
          return axios(error.config)
        })
        .catch(() => {
          // 如果舊換新失敗，登出
          user.logout()
          // 回傳原錯誤到呼叫 axios 的地方
          return Promise.reject(error)
        })
    }
  }
  // 如果失敗的請求沒回應，或不是過期，回傳原錯誤到呼叫 axios 的地方
  return Promise.reject(error)
})
