import { ref, computed } from 'vue'

export default function useUsersSearch(repositories) {
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
