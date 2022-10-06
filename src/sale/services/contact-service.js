import http from '@/core/http-common'

class ContactService {
  endPoint = 'contacts'

  getAll() {
    return http.get(this.endPoint)
  }
  create(contact) {
    return http.post(this.endPoint, {
      fullName: contact.fullName.toUpperCase(),
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
    })
  }
  update(id, contact) {
    return http.put(`${this.endPoint}/${id}`, {
      fullName: contact.fullName.toUpperCase(),
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
    })
  }
  delete(id) {
    return http.delete(`${this.endPoint}/${id}`)
  }
}

export default new ContactService()
