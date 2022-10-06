import http from '@/core/http-common'

class BusinessEntityService {
  endPoint = 'business_entities'

  getAll() {
    return http.get(this.endPoint)
  }
  create(businessEntity) {
    return http.post(this.endPoint, {
      identityNumber: businessEntity.identityNumber,
      name: businessEntity.name.toUpperCase(),
      address: businessEntity.address,
    })
  }
  update(id, businessEntity) {
    return http.put(`${this.endPoint}/${id}`, {
      identityNumber: businessEntity.identityNumber,
      name: businessEntity.name.toUpperCase(),
      address: businessEntity.address,
    })
  }
  delete(id) {
    return http.delete(`${this.endPoint}/${id}`)
  }
}

export default new BusinessEntityService()
