import http from '@/core/http-common'

class UserService {
  endPoint = 'users'

  getAll() {
    return http.get(this.endPoint)
  }

  getInvoicesByUserId(id) {
    return http.get(`${this.endPoint}/${id}/invoices`)
  }

  update(id, user) {
    return http.put(`${this.endPoint}/${id}`, {
      fullName: user.fullName.toUpperCase(),
      phone: user.phone,
      email: user.email,
      username: user.username.toLowerCase(),
      roles: user.roles,
    })
  }
  delete(id) {
    return http.delete(`${this.endPoint}/${id}`)
  }
}

export default new UserService()
