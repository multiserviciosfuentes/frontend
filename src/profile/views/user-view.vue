<template>
  <div>
    <a-typography-title :level="3">USUARIOS</a-typography-title>
    <!--    table product-->
    <a-table
      class="ant-table-striped"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :row-key="_record => _record.id"
      :columns="columnsUsers"
      :data-source="repositoriesSearchQuery"
      :pagination="false"
      :scroll="{ x: 1000, y: 'calc( 100vh - 64px - 40px - 49px - 39px - 40px)' }"
      :loading="loadingUsers"
      size="small"
      bordered
      @change="handleChangeUser"
    >
      <template #title>
        <a-row type="flex">
          <a-col flex="auto">
            <a-space :size="20">
              <a-button type="primary" @click="handleAddUser">
                <template #icon>
                  <plus-outlined></plus-outlined>
                </template>
                Nuevo usuario
              </a-button>
              <a-input-search
                v-model:value="searchQuery"
                placeholder="Buscar usuario"
                :style="{ width: '400px', textTransform: 'uppercase' }"
              />
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

        <template v-else-if="column.dataIndex === 'roles'">
          <span>
            {{
              _.join(
                record.roles.map(x => _.replace(x.name, 'ROLE_', '')),
                ' '
              )
            }}
          </span>
        </template>

        <template v-else-if="column.key === 'operation'">
          <div class="editable-row-operations">
            <span>
              <a @click="handleEditUser(record.id)">Editar</a>
              <!-- <a-divider type="vertical" />
              <a-popconfirm title="Eliminar？" @confirm="handleRemoveUser(record.id)">
                <template #icon><question-circle-outlined style="color: red" /></template>
                <a>Eliminar</a>
              </a-popconfirm> -->
            </span>
          </div>
        </template>
      </template>
    </a-table>

    <template v-if="showDrawerUser">
      <form-user-drawer
        :show="showDrawerUser"
        :is-add="isAddUser"
        :user="formUser"
        @on-close="showDrawerUser = false"
      ></form-user-drawer>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import _ from 'lodash'

import User from '../models/user'
import FormUserDrawer from '../components/form-user-drawer.vue'

import useUsers from '../composables/use-users'
import useUsersSearch from '../composables/use-users-search'
import useUsersVariables from '../composables/use-users-variables'

import { useAuthUserStore } from '@/stores/auth-user-store'
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user-store'
import { message } from 'ant-design-vue'
import { ERole } from '@/shared/enums'

// stores
const authUserStore = useAuthUserStore()
const userStore = useUserStore()

// states
const showDrawerUser = ref(false)
const isAddUser = ref(true)
const formUser = ref(new User())

//composable
const { repositories } = useUsers()
const { searchQuery, repositoriesSearchQuery } = useUsersSearch(repositories)

// computeds
const loadingUsers = computed(() => authUserStore.loading)

const { columnsUsers, handleChange: handleChangeUser } = useUsersVariables()

// functions
const handleAddUser = () => {
  formUser.value = new User()
  showDrawerUser.value = true
  isAddUser.value = true
}

const handleEditUser = id => {
  showDrawerUser.value = true
  isAddUser.value = false
  let objUser = _.cloneDeep(repositories.value.filter(item => item.id === id)[0])
  formUser.value = objUser
  formUser.value.roles = objUser.roles.map(rol => rol.name)
}

const handleRemoveUser = id => {
  message.loading({
    content: 'Eliminando...',
    key: 'remove',
  })

  userStore
    .remove(id)
    .then(response => {
      message.success({
        content: 'Se ha borrado',
        key: 'remove',
      })
    })
    .catch(err => {
      message.success({
        content: err,
        key: 'remove',
      })
    })
}
</script>

<style lang="less" scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #f0f0f0;
}
</style>

<style lang="less">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}

.editable-row-operations a {
  margin-right: 8px;
}

th.column-right,
td.column-right {
  text-align: right !important;
}

th.column-center,
td.column-center {
  text-align: center !important;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
