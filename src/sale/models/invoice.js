import { ETypeCurrency } from '@/shared/enums'
import InvoiceDetail from './invoice-detail'

export default class Invoice {
  constructor(
    dateVoucher = null,
    numberInvoice = null,
    numberBill = null,
    numberProforma = null,
    numberPurchaseOrder = null,
    numberSaleOrder = null,
    numberQuotation = null,
    type = null,
    typeVoucher = null,
    status = null,
    businessEntity = null,
    contact = null,
    movement = null,
    igv = null,
    typeCurrency = ETypeCurrency.soles,
    invoiceDetails = [],
    number = null
  ) {
    this.dateVoucher = dateVoucher
    this.numberInvoice = numberInvoice
    this.numberBill = numberBill
    this.numberProforma = numberProforma
    this.numberQuotation = numberQuotation
    this.numberPurchaseOrder = numberPurchaseOrder
    this.numberSaleOrder = numberSaleOrder
    this.type = type
    this.typeVoucher = typeVoucher
    this.status = status
    this.businessEntity = businessEntity
    this.contact = contact
    this.movement = movement
    this.igv = igv
    this.typeCurrency = typeCurrency
    this.invoiceDetails = invoiceDetails
    this.number = number
  }
}
