export default class Movement {
  constructor(type = null, description = null, invoice = null, direct = null, store = null, scaffold = null) {
    this.type = type
    this.description = description
    this.invoice = invoice
    this.direct = direct
    this.store = store
    this.scaffold = scaffold
  }
}
