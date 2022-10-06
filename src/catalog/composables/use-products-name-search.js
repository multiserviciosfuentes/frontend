import _ from 'lodash'
import { ref, computed } from 'vue'

export default function useProductsNameSearch(repositories) {
  const searchQuery = ref('')
  const searchType = ref('name')
  const repositoriesSearchQuery = computed(() => {
    if (searchType.value === 'name') {
      return repositories.value.filter(repository => {
        return (
          repository.name.toUpperCase().includes(searchQuery.value.toUpperCase()) ||
          (repository.nicknames != null &&
            repository.nicknames.some(x => x.name.toUpperCase().includes(searchQuery.value.toUpperCase())))
        )
      })
    } else {
      return repositories.value.filter(repository => {
        return repository.code.toUpperCase().includes(searchQuery.value.toUpperCase())
      })
    }
  })

  return {
    searchQuery,
    repositoriesSearchQuery,
    searchType,
  }
}
