import { computed } from 'vue'
import { useUnitOfMeasurementStore } from '@/stores/unit-of-measurement-store'

export default function useUnitOfMeasurement() {
  const unitOfMeasurementStore = useUnitOfMeasurementStore()
  return {
    repositories: computed(() => unitOfMeasurementStore.all),
  }
}
