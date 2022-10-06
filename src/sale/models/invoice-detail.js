export default class InvoiceDetail {
  constructor(
    description = null,
    quantity = null,
    price = null,
    quantityOffer = null,
    discount = null,
    product = null
  ) {
    this.description = description
    this.quantity = quantity
    this.price = price
    this.quantityOffer = quantityOffer
    this.discount = discount
    this.product = product
  }
}
