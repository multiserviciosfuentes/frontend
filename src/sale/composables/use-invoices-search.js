import { ref, computed } from 'vue'
import { ESearch, EType } from '@/shared/enums'

export default function useInvoicesSearch(invoices) {
  const searchQuery = ref('')
  const searchType = ref(ESearch.businessEntity)

  const repositoriesSearchQuery = computed(() => {
    if (searchType.value === ESearch.businessEntity) {
      return invoices.value.filter(item =>
        item.businessEntity.name.toUpperCase().includes(searchQuery.value.toUpperCase())
      )
    } else {
      return invoices.value.filter(item =>
        item.numberInvoice !== null
          ? `${item.numberInvoice}`.includes(searchQuery.value)
          : item.numberBill !== null
          ? `${item.numberBill}`.includes(searchQuery.value)
          : item.numberProforma !== null
          ? `${item.numberProforma}`.includes(searchQuery.value)
          : []
      )
    }
  })

  return {
    searchQuery,
    searchType,
    repositoriesSearchQuery,
  }
}
