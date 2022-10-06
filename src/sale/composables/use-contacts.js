import { useContactStore } from '@/stores/contact-store'
import { computed } from 'vue'

export default function useContacts() {
  const contactStore = useContactStore()
  return {
    contacts: computed(() => contactStore.all),
  }
}
