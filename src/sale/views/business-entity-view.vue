<template>
  <div>
    <a-typography-title :level="3">ENTIDADES</a-typography-title>

    <!--    table BusinessEntity-->
    <a-table
      class="ant-table-striped"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :row-key="_record => _record.id"
      :columns="columnsBusinessEntity"
      :data-source="repositoriesSearchQuery"
      :pagination="false"
      :scroll="{ x: 1000, y: 'calc( 100vh - 64px - 40px - 49px - 39px - 40px)' }"
      :loading="loading"
      size="small"
      bordered
      @change="handleChange"
    >
      <template #title>
        <a-row type="flex">
          <a-col flex="auto">
            <a-space :size="20">
              <a-button type="primary" @click="onShowAdd">
                <template #icon>
                  <plus-outlined></plus-outlined>
                </template>
                Nueva entidad
              </a-button>
              <a-input-group compact>
                <a-input-search
                  v-model:value="searchQuery"
                  :placeholder="'Buscar nombre'"
                  :style="{ width: '400px', textTransform: 'uppercase' }"
                />
              </a-input-group>
            </a-space>
          </a-col>
        </a-row>
      </template>

      <template #bodyCell="{ column, text, record, index }">
        <template v-if="column.key === 'index'">
          <span>
            {{ (index += 1) }}
          </span>
        </template>

        <template v-else-if="column.key === 'action'">
          <div class="editable-row-operations">
            <span>
              <a @click="onShowEdit(record.id)">Editar</a>
              <a-divider type="vertical" />

              <a-popconfirm title="Eliminar？" @confirm="onDeleteBusinessEntity(record.id)">
                <template #icon><question-circle-outlined style="color: red" /></template>
                <a>Eliminar</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </template>
    </a-table>

    <template v-if="visibleDrawerBusinessEntity">
      <add-business-entity-drawer
        :show="visibleDrawerBusinessEntity"
        :is-add="isAddBusinessEntity"
        :business-entity="selected"
        @on-close="visibleDrawerBusinessEntity = false"
      ></add-business-entity-drawer>
    </template>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useBusinessEntityStore } from '@/stores/business-entity-store'
import { computed, onUnmounted, ref } from 'vue'
import BusinessEntity from '../models/business-entity'
import useBusinessEntities from '@/sale/composables/use-business-entities'
import useBusinessEntitiesNameSearch from '@/sale/composables/use-business-entites-name-search'
import useBusinessEntityVariables from '../composables/use-business-entity-variables'
import AddBusinessEntityDrawer from '../components/form-business-entity-drawer.vue'
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const businessEntityStore = useBusinessEntityStore()

// states
const visibleDrawerBusinessEntity = ref(false)
const isAddBusinessEntity = ref(true)
const selected = ref(new BusinessEntity())

//composable
const { businessEntities } = useBusinessEntities()
const { searchQuery, repositoriesSearchQuery } = useBusinessEntitiesNameSearch(businessEntities)
const { columnsBusinessEntity, handleChange } = useBusinessEntityVariables()

// computeds
const loading = computed(() => businessEntityStore.loading)

// functions
const onShowAdd = () => {
  selected.value = new BusinessEntity()
  visibleDrawerBusinessEntity.value = true
  isAddBusinessEntity.value = true
}

const onShowEdit = id => {
  visibleDrawerBusinessEntity.value = true
  selected.value = _.cloneDeep(businessEntities.value.filter(item => item.id === id)[0])
  isAddBusinessEntity.value = false
}

const onDeleteBusinessEntity = id => {
  message.loading({
    content: 'Eliminando...',
    key: 'updatable',
  })
  businessEntityStore
    .remove(id)
    .then(response => {
      message.success({
        content: 'Se ha eliminado',
        key: 'updatable',
        duration: 3,
      })
    })
    .catch(err => {
      message.error({
        content: err,
        key: 'updatable',
        duration: 3,
      })
    })
}
</script>

<style lang="less" scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #f0f0f0;
}
</style>
