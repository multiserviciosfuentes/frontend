import { useMovementStore } from '@/stores/movement-store'
import { computed } from 'vue'

export default function useMovements() {
  const movementStore = useMovementStore()
  return {
    repositories: computed(() => movementStore.all),
  }
}
