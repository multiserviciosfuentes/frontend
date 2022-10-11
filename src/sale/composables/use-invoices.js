import { computed } from 'vue'
import { useInvoiceStore } from '@/stores/invoice-store'
import { EType } from '@/shared/enums'

export default function useInvoices(type) {
  const invoiceStore = useInvoiceStore()

  const repositories = computed(() => {
    let invoices = computed(() => invoiceStore.all)
    if (type === EType.quotation) {
      return invoices.value.filter(item => item.type === EType.sale).filter(item => item.numberQuotation !== null)
    } else if (type === EType.sale) {
      return invoices.value.filter(item => item.type === EType.sale).filter(item => item.numberSaleOrder)
    } else {
      return invoices.value.filter(item => item.type === EType.buy).filter(item => item.numberPurchaseOrder)
    }
  })

  return {
    repositories,
  }
}
