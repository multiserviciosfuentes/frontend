export default class Product {
  constructor(code = null, name = null, price = null, pathImage = null, unitOfMeasurement = null, nicknames = []) {
    this.code = code
    this.name = name
    this.unitOfMeasurement = unitOfMeasurement
    this.price = price
    this.pathImage = pathImage
    this.nicknames = nicknames
  }
}
