import { computed } from 'vue'
import { useProductStore } from '@/stores/product-store'

export default function useProducts() {
  const productStore = useProductStore()
  return {
    products: computed(() => productStore.all),
  }
}
