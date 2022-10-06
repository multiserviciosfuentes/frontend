import { ref, computed } from 'vue'

export default function useBusinessEntitiesNameSearch(repositories) {
  const searchQuery = ref('')
  const repositoriesSearchQuery = computed(() => {
    return repositories.value.filter(repository => {
      return repository.name.toUpperCase().includes(searchQuery.value.toUpperCase())
    })
  })

  return {
    searchQuery,
    repositoriesSearchQuery,
  }
}
