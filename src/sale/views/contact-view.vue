<template>
  <div>
    <a-typography-title :level="3">CONTACTOS</a-typography-title>

    <!--    table Contact-->
    <a-table
      class="ant-table-striped"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :row-key="_record => _record.id"
      :columns="columnsContact"
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
                Nuevo contacto
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

              <a-popconfirm title="Eliminar？" @confirm="onDeleteContact(record.id)">
                <template #icon><question-circle-outlined style="color: red" /></template>
                <a>Eliminar</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </template>
    </a-table>

    <template v-if="showDrawerContact">
      <form-contact-drawer
        :show="showDrawerContact"
        :is-add="isAddContact"
        :contact="selected"
        @on-close="showDrawerContact = false"
      ></form-contact-drawer>
    </template>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useContactStore } from '@/stores/contact-store'
import { computed, ref } from 'vue'
import Contact from '../models/contact'
import useContacts from '@/sale/composables/use-contacts'
import useContactsNameSearch from '@/sale/composables/use-contacts-name-search'
import useContactVariables from '../composables/use-contact-variables'
import FormContactDrawer from '../components/form-contact-drawer.vue'
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const contactStore = useContactStore()

// states
const showDrawerContact = ref(false)
const isAddContact = ref(true)
const selected = ref(new Contact())

//composable
const { contacts } = useContacts()
const { searchQuery, repositoriesSearchQuery } = useContactsNameSearch(contacts)
const { columnsContact, handleChange } = useContactVariables()

// computeds
const loading = computed(() => contactStore.loading)

// functions
const onShowAdd = () => {
  selected.value = new Contact()
  showDrawerContact.value = true
  isAddContact.value = true
}

const onShowEdit = id => {
  showDrawerContact.value = true
  selected.value = _.cloneDeep(contacts.value.filter(item => item.id === id)[0])
  isAddContact.value = false
}

const onDeleteContact = id => {
  message.loading({
    content: 'Eliminando...',
    key: 'updatable',
  })
  contactStore
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
