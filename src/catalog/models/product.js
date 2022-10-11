import { ETypeCurrency } from '@/shared/enums'

export default class Product {
  constructor(
    code = null,
    name = null,
    price = null,
    priceSale = null,
    pathImage = null,
    unitOfMeasurement = null,
    typeCurrency = ETypeCurrency.soles,
    nicknames = []
  ) {
    this.code = code
    this.name = name
    this.unitOfMeasurement = unitOfMeasurement
    this.price = price
    this.priceSale = priceSale
    this.pathImage = pathImage
    this.typeCurrency = typeCurrency
    this.nicknames = nicknames
  }
}
