import http from '@/core/http-common'

class ProductService {
  endPoint = 'products'

  getAll() {
    return http.get(this.endPoint)
  }

  getMovementsByProductId(productId) {
    return http.get(`${this.endPoint}/${productId}/movements`)
  }

  create(product) {
    return http.post(this.endPoint, {
      code: product.code.toUpperCase(),
      name: product.name.toUpperCase(),
      unitOfMeasurement: product.unitOfMeasurement,
      price: product.price,
      priceSale: product.priceSale,
      pathImage: product.pathImage,
      typeCurrency: product.typeCurrency,
      nicknames: product.nicknames,
    })
  }
  update(id, product) {
    return http.put(`${this.endPoint}/${id}`, {
      code: product.code.toUpperCase(),
      name: product.name.toUpperCase(),
      unitOfMeasurement: product.unitOfMeasurement,
      price: product.price,
      priceSale: product.priceSale,
      pathImage: product.pathImage,
      typeCurrency: product.typeCurrency,
      nicknames: product.nicknames,
    })
  }
  delete(id) {
    return http.delete(`${this.endPoint}/${id}`)
  }

  uploadImage(file) {
    return http.post(`${this.endPoint}/upload`, file)
  }
}

export default new ProductService()
