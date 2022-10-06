import { computed } from 'vue'
import { useInvoiceStore } from '@/stores/invoice-store'
import { EType } from '@/shared/enums'

export default function useInvoices(type) {
  const invoiceStore = useInvoiceStore()

  const repositories = computed(() => {
  let invoices = computed(() => invoiceStore.all)
    if (type === EType.quotation) {
      return invoices.value.filter(item => item.numberQuotation !== null)
    } else {
      return invoices.value.filter(
        item => item.numberInvoice !== null || item.numberBill !== null || item.numberProforma !== null
      )
    }
  })

  return {
    repositories,
  }
}
