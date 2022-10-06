import http from '@/core/http-common'

class InvoiceDetailService {
  endPoint = 'invoice_details'

  getAll() {
    return http.get(this.endPoint)
  }
  update(invoiceId, invoiceDetailId, invoiceDetail) {
    console.log(invoiceDetail)
    return http.put(`/invoices/${invoiceId}/${this.endPoint}/${invoiceDetailId}`, {
      description: invoiceDetail.description.toUpperCase(),
      quantity: invoiceDetail.quantity,
      quantityOffer: invoiceDetail.quantityOffer,
      discount: invoiceDetail.discount,
      price: invoiceDetail.price,
    })
  }
  delete(invoiceId, invoiceDetailId) {
    return http.delete(`/invoices/${invoiceId}/${this.endPoint}/${invoiceDetailId}`)
  }
}

export default new InvoiceDetailService()
