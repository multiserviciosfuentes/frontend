import axiosInstance from '@/core/http-common'
import TokenService from './token-service'
import { useAuthUserStore } from '@/stores/auth-user-store'

const setup = () => {
  axiosInstance.interceptors.request.use(
    config => {
      const token = TokenService.getLocalAccessToken()
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token // for Spring Boot back-end
        // config.headers["x-access-token"] = token; // for Node.js Express back-end
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    res => {
      return res
    },
    async err => {
      const originalConfig = err.config

      if (originalConfig.url !== '/auth/sign_in' && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true

          try {
            const rs = await axiosInstance.post('/auth/refresh_token', {
              refreshToken: TokenService.getLocalRefreshToken(),
            })

            const { accessToken } = rs.data

            const authUserStore = useAuthUserStore()
            authUserStore.refreshToken(accessToken)
            TokenService.updateLocalAccessToken(accessToken)

            return axiosInstance(originalConfig)
          } catch (_error) {
            return Promise.reject(_error)
          }
        }
      }

      return Promise.reject(err)
    }
  )
}

export default setup
