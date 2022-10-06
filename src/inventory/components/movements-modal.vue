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
      :data-source="movements"
      :loading="loadingMovements"
      :pagination="false"
      :scroll="{ x: 1000, y: 'calc( 100vh - 200px)' }"
      size="small"
      bordered
    >
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
            {{ record.direct !== null ? record.direct.user.username : record.invoice.user.username }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'type'">
          <span>
            {{ record.type === ETypeMovement.input ? 'ENTRADA' : 'SALIDA' }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'form'">
          <span v-if="record.direct !== null"> DIRECTO </span>
          <span v-else>
            <a-tag v-if="record.invoice.numberInvoice !== null" color="orange">
              {{ `FACTURA-${record.invoice.numberInvoice}` }}</a-tag
            >
            <a-tag v-else-if="record.invoice.numberBill !== null" color="green">
              {{ `BOLETA DE VENTA-${record.invoice.numberBill}` }}
            </a-tag>
            <a-tag v-else color="cyan"> {{ `PROFORMA-${record.invoice.numberProforma}` }} </a-tag>
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'input'">
          <span>
            {{
              record.type === ETypeMovement.input && record.direct !== null
                ? record.direct.quantity
                : record.type === ETypeMovement.input && record.invoice !== null
                ? record.invoice.invoiceDetails.filter(item => item.product.id === currentProduct.id)[0].quantity
                : '-'
            }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'output'">
          <span>
            {{
              record.type === ETypeMovement.output && record.direct !== null
                ? record.direct.quantity
                : record.type === ETypeMovement.output && record.invoice !== null
                ? record.invoice.invoiceDetails.filter(item => item.product.id === currentProduct.id)[0].quantity
                : '-'
            }}
          </span>
        </template>
      </template>
    </a-table>
  </a-modal>
</template>

<script setup>
import useMovementsVariables from '../composables/use-movements-variables'
import { useProductStore } from '@/stores/product-store'
import { computed, onMounted, ref, watch } from 'vue'
import { SyncOutlined } from '@ant-design/icons-vue'
import useMovements from '../composables/use-movements'
import useMovementsByProduct from '../composables/use-movements-by-product'
import { dateParse } from '@/shared/methods'
import { ETypeMovement } from '@/shared/enums'

const props = defineProps({
  show: Boolean,
  product: {
    type: Object,
    required: true,
  },
})

const { columnsMovements } = useMovementsVariables()
const productStore = useProductStore()
const currentProduct = ref(props.product)
const title = ref(props.product.name)

const movements = ref([])
const loadingMovements = computed(() => productStore.loading)
const loadMovements = computed(() => productStore.loading)

const { repositories } = useMovements()
const { getAllByProductId } = useMovementsByProduct(repositories)

onMounted(() => {
  movements.value = getAllByProductId(props.product.id)
})
</script>

<style lang="less" scoped></style>
