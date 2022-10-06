import http from '@/core/http-common'

class UnitOfMeasurementService {
  endPoint = 'unit_of_measurements'

  getAll() {
    return http.get(this.endPoint)
  }
  create(unitOfMeasurement) {
    return http.post(this.endPoint, {
      name: unitOfMeasurement.name.toUpperCase(),
    })
  }
  update(id, unitOfMeasurement) {
    return http.put(`${this.endPoint}/${id}`, {
      name: unitOfMeasurement.name.toUpperCase(),
    })
  }
  delete(id) {
    return http.delete(`${this.endPoint}/${id}`)
  }
}

export default new UnitOfMeasurementService()
