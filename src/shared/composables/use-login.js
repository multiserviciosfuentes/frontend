import { useAuthUserStore } from '@/stores/auth-user-store'
import { useBusinessEntityStore } from '@/stores/business-entity-store'
import { useContactStore } from '@/stores/contact-store'
import { useInvoiceStore } from '@/stores/invoice-store'
import { useMovementStore } from '@/stores/movement-store'
import { useProductStore } from '@/stores/product-store'
import { useUnitOfMeasurementStore } from '@/stores/unit-of-measurement-store'
import { computed } from 'vue'

export default function useLogin() {
  const authUserStore = useAuthUserStore()
  const productStore = useProductStore()
  const unitOfMeasurementStore = useUnitOfMeasurementStore()
  const businessEntityStore = useBusinessEntityStore()
  const contactStore = useContactStore()
  const invoiceStore = useInvoiceStore()
  const movementStore = useMovementStore()

  const loggedIn = computed(() => authUserStore.status.loggedIn)

  const laodData = () => {
    if (loggedIn.value) {
      productStore.getAll()
      unitOfMeasurementStore.getAll()
      businessEntityStore.getAll()
      contactStore.getAll()
      invoiceStore.getInvoicesByUserId(authUserStore.userCurrent.id)
      movementStore.getAll()
    }
  }

  return {
    laodData,
  }
}
