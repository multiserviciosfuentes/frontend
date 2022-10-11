<template>
  <a-modal
    :visible="show"
    width="100%"
    wrap-class-name="full-modal"
    @cancel="$emit('onClose')"
    @onOk="$emit('onClose')"
  >
    <template #title>
      <span>
        <a-tag color="green">
          <template #icon>
            <sync-outlined :spin="true" />
          </template>
          {{ title }}
        </a-tag>
      </span>
    </template>

    <a-table
      class="ant-table-striped"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :row-key="_record => _record.id"
      :columns="columnsMovements"
      :data-source="repositoresFilterSearch"
      :loading="loadingMovements"
      :pagination="false"
      :scroll="{ x: 1000, y: 'calc( 100vh - 280px)' }"
      size="small"
      bordered
      @change="handleChange"
    >
      <template #title>
        <a-space>
          <a-button size="small" type="primary" @click="handlePrintMovements">
            <template #icon>
              <file-pdf-outlined />
            </template>

            Descargar PDF</a-button
          >

          <a-select
            placeholder="Seleccionar filtro"
            size="small"
            ref="select"
            v-model:value="selectedFilter"
            style="width: 150px"
          >
            <a-select-option :value="ETypeFilter.all">Todos</a-select-option>
            <a-select-option :value="ETypeFilter.day">Día</a-select-option>
            <a-select-option :value="ETypeFilter.week">Semana</a-select-option>
            <a-select-option :value="ETypeFilter.month">Mes</a-select-option>
            <a-select-option :value="ETypeFilter.year">Año</a-select-option>
            <a-select-option :value="ETypeFilter.interval">Intervalo</a-select-option>
          </a-select>

          <a-range-picker
            format="DD/MM/YYYY"
            size="small"
            v-if="selectedFilter === ETypeFilter.interval"
            v-model:value="dateInterval"
          />
        </a-space>
      </template>

      <template #bodyCell="{ column, text, record, index }">
        <template v-if="column.key === 'index'">
          <span>
            {{ (index = index + 1) }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'createdAt'">
          <span>
            {{ dateParse(text) }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'username'">
          <span>
            {{ record.user.username }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'type'">
          <span>
            {{ record.type === ETypeMovement.input ? 'ENTRADA' : 'SALIDA' }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'input'">
          <span>
            {{ record.type === ETypeMovement.input ? record.quantity : '-' }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'output'">
          <span>
            {{ record.type === ETypeMovement.output ? record.quantity : '-' }}
          </span>
        </template>
      </template>

      <template #summary>
        <a-table-summary fixed>
          <a-table-summary-row :style="{ background: '#CAE6FF' }">
            <a-table-summary-cell :col-span="6"></a-table-summary-cell>
            <a-table-summary-cell :style="{ textAlign: 'center', fontWeight: 'bold' }">
              <a-typography-text type="success">{{
                repositoresFilterSearch
                  .filter(item => item.type === ETypeMovement.input)
                  .reduce((x, item) => x + item.quantity, 0)
              }}</a-typography-text>
            </a-table-summary-cell>
            <a-table-summary-cell :style="{ textAlign: 'center', fontWeight: 'bold' }">
              <a-typography-text type="danger">{{
                repositoresFilterSearch
                  .filter(item => item.type === ETypeMovement.output)
                  .reduce((x, item) => x + item.quantity, 0)
              }}</a-typography-text>
            </a-table-summary-cell>
          </a-table-summary-row>
        </a-table-summary>
      </template>
    </a-table>
  </a-modal>
</template>

<script setup>
import useMovements from '../composables/use-movements'
import useMovementsVariables from '../composables/use-movements-variables'
import useMovementsByProduct from '../composables/use-movements-by-product'
import useMovementsFilter from '../composables/use-movements-filter'
import useMovementsPrint from '../composables/prints/use-movements-print'
import { useProductStore } from '@/stores/product-store'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { SyncOutlined, FilePdfOutlined } from '@ant-design/icons-vue'
import { dateParse } from '@/shared/methods'
import { ETypeMovement, ETypeFilter } from '@/shared/enums'
import dayjs from 'dayjs'
import { es } from 'dayjs/locale/es'
import localeData from 'dayjs/plugin/localeData'
import _ from 'lodash'

dayjs.locale('es')
dayjs.extend(localeData)

const props = defineProps({
  show: Boolean,
  product: {
    type: Object,
    required: true,
  },
})

const { columnsMovements, handleChange } = useMovementsVariables()
const productStore = useProductStore()
const currentProduct = ref(props.product)
const title = ref(props.product.name)

const movements = ref([])
const loadingMovements = computed(() => productStore.loading)

const { repositories } = useMovements()
const { getAllByProductId } = useMovementsByProduct(repositories)
const { selectedFilter, dateInterval, repositoresFilterSearch } = useMovementsFilter(movements)

const variablesPrint = reactive({
  title: 'Semanal',
  movements: [],
})

watch(selectedFilter, () => {
  if (selectedFilter.value === ETypeFilter.all) {
    variablesPrint.title = 'Todos'
  } else if (selectedFilter.value === ETypeFilter.day) {
    variablesPrint.title = dayjs().format('DD/MM/YYYY')
  } else if (selectedFilter.value === ETypeFilter.week) {
    variablesPrint.title = `Semanal`
  } else if (selectedFilter.value === ETypeFilter.month) {
    variablesPrint.title = `${_.capitalize(dayjs.months().at(dayjs().month() - 1))}`
  } else if (selectedFilter.value === ETypeFilter.year) {
    variablesPrint.title = `${dayjs().year()}`
  }
})

const { onPrint: printMovements } = useMovementsPrint()
const handlePrintMovements = () => {
  variablesPrint.title =
    dateInterval.value !== null
      ? `${dateInterval.value.at(0).format('DD/MM/YYYY')} - ${dateInterval.value.at(1).format('DD/MM/YYYY')}`
      : '-'
  variablesPrint.movements = _.reverse(repositoresFilterSearch.value)
  printMovements(variablesPrint)
}

onMounted(() => {
  movements.value = getAllByProductId(props.product.id)
})
</script>

<style lang="less" scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #f0f0f0;
}
</style>
