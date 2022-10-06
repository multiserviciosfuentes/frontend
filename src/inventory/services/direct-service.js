import http from '@/core/http-common'
import { ETypeMovement } from '@/shared/enums'

class UnitOfMeasurementService {
  endPoint = 'directs'

  create({ quantity, price, product, movement, user }) {
    movement.type = movement.type === ETypeMovement.input ? 0 : 1
    return http.post(this.endPoint, {
      quantity,
      price,
      product,
      movement,
      user,
    })
  }
  delete(id) {
    return http.delete(`${this.endPoint}/${id}`)
  }
}

export default new UnitOfMeasurementService()
