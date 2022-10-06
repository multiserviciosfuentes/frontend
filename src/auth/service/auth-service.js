import http from '@/core/http-common'
import TokenService from './token-service'

class AuthService {
  endPoint = 'auth/'

  login(user) {
    return http
      .post(this.endPoint + 'sign_in', {
        username: user.username.toLowerCase(),
        password: user.password.toLowerCase(),
      })
      .then(response => {
        if (response.data.accessToken) {
          TokenService.setUser(response.data)
        }
        return response.data
      })
  }

  logout() {
    return http.post(this.endPoint + 'sign_out')
  }

  register(user) {
    return http.post(this.endPoint + 'sign_up', {
      fullName: user.fullName.toUpperCase(),
      phone: user.phone,
      email: user.email,
      username: user.username.toLowerCase(),
      password: user.password.toLowerCase(),
      roles: user.roles,
    })
  }
}
export default new AuthService()
