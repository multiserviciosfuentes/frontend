<template>
  <a-drawer
    :title="isAdd ? 'Agregar contacto' : 'Editar contacto'"
    :placement="isAdd ? 'left' : 'right'"
    :width="720"
    :visible="show"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="$emit('onClose')"
    :maskClosable="false"
  >
    <a-form layout="vertical">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Nombre y Apellidos" name="fullName" v-bind="validateInfos.fullName">
            <a-input
              v-model:value="contact.fullName"
              placeholder="Ingresar nombre y apellidos"
              :style="{ textTransform: 'uppercase' }"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Teléfono" name="phone" v-bind="validateInfos.phone">
            <a-input v-model:value="contact.phone" placeholder="Ingresar teléfono" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Correo electrónico" name="email" v-bind="validateInfos.email">
            <a-input v-model:value="contact.email" placeholder="Ingresar correo electrónico" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Dirección" name="address" v-bind="validateInfos.address">
            <a-input v-model:value="contact.address" placeholder="Ingresar dirección" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <template #extra>
      <a-space>
        <a-button @click="$emit('onClose')">Cancel</a-button>
        <a-button type="primary" @click="onSave" :loading="loading">Aceptar</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup>
import { useContactStore } from '@/stores/contact-store'
import { Form, message } from 'ant-design-vue'
import { ref, watch } from 'vue'
import Contact from '../models/contact'
import useContactVariables from '../composables/use-contact-variables'

const props = defineProps({
  show: Boolean,
  isAdd: {
    type: Boolean,
    default: true,
  },
  contact: Object,
})

const emit = defineEmits(['onClose', 'onSubmit'])

// stores
const contactStore = useContactStore()
const useForm = Form.useForm

// states
const loading = ref(false)
const contact = ref(props.contact)

// composables
const { rules } = useContactVariables()
const { resetFields, validate, validateInfos } = useForm(contact, rules)

// functions
const onSave = () => {
  validate()
    .then(() => {
      loading.value = true
      if (props.isAdd) {
        contactStore
          .add(contact.value)
          .then(response => {
            emit('onSubmit', response.id, false)
            message.success('Entidad agregada')
            resetFields()
          })
          .catch(e => {
            message.error(`Detalle de error: ${e}`)
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        contactStore
          .update(contact.value)
          .then(response => {
            close()
            message.success('Entidad editada')
          })
          .catch(e => {
            message.error(`Detalle de error: ${e}`)
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

const close = () => {
  emit('onClose')
}
</script>

<style lang="scss" scoped></style>
