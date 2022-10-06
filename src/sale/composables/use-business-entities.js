import { useBusinessEntityStore } from '@/stores/business-entity-store'
import { computed } from 'vue'

export default function useBusinessEntities() {
  const businessEntityStore = useBusinessEntityStore()
  return {
    businessEntities: computed(() => businessEntityStore.all),
  }
}
