import { ETypeFilter } from '@/shared/enums'
import isBetween from 'dayjs/plugin/isBetween'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'

dayjs.extend(isBetween)

export default function useMovementsFilter(repositores) {
  const selectedFilter = ref(ETypeFilter.all)
  const dateInterval = ref(null)

  const repositoresFilterSearch = computed(() => {
    switch (selectedFilter.value) {
      case ETypeFilter.day:
        return repositores.value.filter(repository => dayjs().isSame(repository.createdAt, 'day'))
      case ETypeFilter.week:
        return repositores.value.filter(repository => dayjs(repository.createdAt).week() === dayjs().week())
      case ETypeFilter.month:
        return repositores.value.filter(repository => dayjs().isSame(repository.createdAt, 'month'))
      case ETypeFilter.year:
        return repositores.value.filter(repository => dayjs().isSame(repository.createdAt, 'year'))
      case ETypeFilter.interval:
        if (dateInterval.value !== null) {
          return repositores.value.filter(repository =>
            dayjs(repository.createdAt).isBetween(dateInterval.value.at(0), dateInterval.value.at(1), 'day', '[]')
          )
        } else return repositores.value

      default:
        return repositores.value
    }
  })

  return {
    selectedFilter,
    dateInterval,
    repositoresFilterSearch,
  }
}
