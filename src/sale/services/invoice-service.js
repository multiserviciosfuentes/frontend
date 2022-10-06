import http from '@/core/http-common'
import { ETypeMovement } from '@/shared/enums'

class InvoiceService {
  endPoint = 'invoices'

  getAll() {
    return http.get(this.endPoint)
  }

  create(invoice) {
    if (invoice.movement !== null) invoice.movement.type = invoice.movement.type === ETypeMovement.input ? 0 : 1
    return http.post(this.endPoint, {
      dateVoucher: invoice.dateVoucher,
      numberInvoice: invoice.numberInvoice,
      numberBill: invoice.numberBill,
      numberProforma: invoice.numberProforma,
      numberPurchaseOrder: invoice.numberPurchaseOrder,
      status: invoice.status,
      type: invoice.type,
      typeVoucher: invoice.typeVoucher,
      businessEntity: invoice.businessEntity,
      contact: invoice.contact,
      movement: invoice.movement,
      user: invoice.user,
      invoiceDetails: invoice.invoiceDetails,
    })
  }

  delete(id) {
    return http.delete(`${this.endPoint}/${id}`)
  }

  update(id, invoice) {
    return http.put(`${this.endPoint}/${id}`, {
      dateVoucher: invoice.dateVoucher,
      numberInvoice: invoice.numberInvoice,
      numberBill: invoice.numberBill,
      numberProforma: invoice.numberProforma,
      numberPurchaseOrder: invoice.numberPurchaseOrder,
      status: invoice.status,
      typeVoucher: invoice.typeVoucher,
      type: invoice.type,
      businessEntity: invoice.businessEntity,
      contact: invoice.contact,
      movement: invoice.movement,
      invoiceDetails: invoice.invoiceDetails,
    })
  }

  patch(id, invoice) {
    if (invoice.movement !== null) invoice.movement.type = invoice.movement.type === ETypeMovement.input ? 0 : 1
    return http.patch(`${this.endPoint}/${id}`, {
      status: invoice.status,
      typeVoucher: invoice.typeVoucher,
      numberInvoice: invoice.numberInvoice,
      numberBill: invoice.numberBill,
      numberProforma: invoice.numberProforma,
      movement: invoice.movement,
    })
  }
}

export default new InvoiceService()
