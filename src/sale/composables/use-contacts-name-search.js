import { ref, computed } from 'vue'

export default function useContactsNameSearch(repositories) {
  const searchQuery = ref('')
  const repositoriesSearchQuery = computed(() => {
    return repositories.value.filter(repository => {
      return repository.fullName.toUpperCase().includes(searchQuery.value.toUpperCase())
    })
  })

  return {
    searchQuery,
    repositoriesSearchQuery,
  }
}
