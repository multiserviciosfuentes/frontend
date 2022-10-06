import InvoiceDetail from './invoice-detail'

export default class Invoice {
  constructor(
    dateVoucher = null,
    numberInvoice = null,
    numberBill = null,
    numberProforma = null,
    numberPurchaseOrder = null,
    numberQuotation = null,
    type = null,
    typeVoucher = null,
    status = null,
    businessEntity = null,
    contact = null,
    movement = null,
    invoiceDetails = []
  ) {
    this.dateVoucher = dateVoucher
    this.numberInvoice = numberInvoice
    this.numberBill = numberBill
    this.numberProforma = numberProforma
    this.numberQuotation = numberQuotation
    this.numberPurchaseOrder = numberPurchaseOrder
    this.type = type
    this.typeVoucher = typeVoucher
    this.status = status
    this.businessEntity = businessEntity
    this.contact = contact
    this.movement = movement
    this.invoiceDetails = invoiceDetails
  }
}
