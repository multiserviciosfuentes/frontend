import { computed } from 'vue'
import { useUserStore } from '@/stores/user-store'

export default function useUsers() {
  const userStore = useUserStore()
  return {
    repositories: computed(() => userStore.all),
  }
}
