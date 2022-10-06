<template>
  <div>
    <a-drawer
      :title="isAdd ? 'Agregar usuario' : 'Editar usuario'"
      :placement="isAdd ? 'left' : 'right'"
      :width="720"
      :visible="show"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="$emit('onClose')"
      :maskClosable="false"
    >
      <a-form ref="formRef" :model="formUser" :rules="rules" name="validate_other" v-bind="formItemLayout">
        <!-- <a-form-item
          name="role"
          label="Rol"
          has-feedback
          :rules="[{ required: true, message: 'Debe seleccionar rol!' }]"
        >
          <a-select v-model:value="formUser.role" placeholder="Seleccionar rol">
            <a-select-option :value="ERole.admin">Administrador</a-select-option>
            <a-select-option :value="ERole.moderator">Moderador</a-select-option>
            <a-select-option :value="ERole.user">Usuario</a-select-option>
          </a-select>
        </a-form-item> -->

        <a-form-item label="Roles" name="roles">
          <a-checkbox-group v-model:value="formUser.roles">
            <a-checkbox :value="ERole.admin" name="type">Admin</a-checkbox>
            <a-checkbox :value="ERole.moderator" name="type">Moderador</a-checkbox>
            <a-checkbox :value="ERole.user" name="type" disabled>Usuario</a-checkbox>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item has-feedback label="Usuario" name="username">
          <a-input v-model:value="formUser.username" placeholder="Insertar usuario" />
        </a-form-item>

        <template v-if="isAdd">
          <a-form-item has-feedback label="Password" name="password">
            <a-input v-model:value="formUser.password" type="password" autocomplete="off" />
          </a-form-item>

          <a-form-item has-feedback label="Confirmar" name="checkPass">
            <a-input v-model:value="formUser.checkPass" type="password" autocomplete="off" />
          </a-form-item>
        </template>

        <a-form-item has-feedback label="Nombre" name="fullName">
          <a-input v-model:value="formUser.fullName" placeholder="Insertar nombre" />
        </a-form-item>

        <a-form-item has-feedback label="Teléfono" name="phone">
          <a-input v-model:value="formUser.phone" type="email" placeholder="Insertar teléfono" />
        </a-form-item>

        <a-form-item has-feedback label="Email" name="email">
          <a-input v-model:value="formUser.email" placeholder="Insertar email" />
        </a-form-item>
      </a-form>

      <template #extra>
        <a-space>
          <a-button @click="$emit('onClose')">Cancel</a-button>
          <a-button @click="onSave" type="primary" :loading="loading">Aceptar</a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import _ from 'lodash'

import useUsersVariables from '../composables/use-users-variables'

import { ERole } from '@/shared/enums'
import { useAuthUserStore } from '@/stores/auth-user-store'
import User from '../models/user'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user-store'

const props = defineProps({
  show: Boolean,
  isAdd: {
    type: Boolean,
    default: true,
  },
  user: Object,
})

const emit = defineEmits(['onClose', 'onSubmit'])

const formUser = ref(props.user)
const loading = ref(false)

// stores
const authUserStore = useAuthUserStore()
const userStore = useUserStore()
const { formItemLayout } = useUsersVariables()

// states

const formRef = ref()

// functions
const onSave = () => {
  formRef.value
    .validate()
    .then(() => {
      let objUser = _.cloneDeep(formUser.value)
      loading.value = true

      if (props.isAdd) {
        authUserStore
          .register(objUser)
          .then(response => {
            message.success('Usuario agregado')
            emit('onClose')
            formRef.value.resetFields()
          })
          .catch(err => {
            message.error(err)
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        userStore
          .update(objUser)
          .then(response => {
            message.success('Usuario editado')
            emit('onClose')
            formRef.value.resetFields()
          })
          .catch(err => {
            message.error(err)
          })
          .finally(() => {
            loading.value = false
          })
      }
    })
    .catch(e => {
      console.log(e)
    })
}

let validatePass = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('Ingresa password')
  } else {
    if (formUser.value.checkPass !== '') {
      formRef.value.validateFields('checkPass')
    }
    return Promise.resolve()
  }
}

let validatePass2 = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('Ingresar password')
  } else if (value !== formUser.value.password) {
    return Promise.reject('No es mismo password!')
  } else {
    return Promise.resolve()
  }
}

const rules = {
  fullName: [
    {
      required: true,
      message: 'Ingresar nombre',
    },
  ],
  username: [
    {
      required: true,
      message: 'Ingresar usuario',
    },
  ],
  password: [
    {
      required: true,
      validator: validatePass,
      trigger: 'change',
    },
  ],
  checkPass: [
    {
      validator: validatePass2,
      trigger: 'change',
    },
  ],
}
</script>

<style lang="less">
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
