import http from '@/core/http-common'

class MovementService {
  endPoint = 'movements'

  getAll() {
    return http.get(this.endPoint)
  }
}

export default new MovementService()
