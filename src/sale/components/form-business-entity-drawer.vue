<template>
  <a-drawer
    :title="isAdd ? 'Agregar entidad' : 'Editar entidad'"
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
          <a-form-item label="RUC/DNI" name="identityNumber" v-bind="validateInfos.identityNumber">
            <a-input v-model:value="businessEntityCurrent.identityNumber" placeholder="Ingresar RUC/DNI" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Nombre" name="name" v-bind="validateInfos.name">
            <a-input
              v-model:value="businessEntityCurrent.name"
              placeholder="Ingresar nombre"
              :style="{ textTransform: 'uppercase' }"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Dirección" name="address" v-bind="validateInfos.address">
            <a-input v-model:value="businessEntityCurrent.address" placeholder="Ingresar dirección" />
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
import { useBusinessEntityStore } from '@/stores/business-entity-store'
import { Form, message } from 'ant-design-vue'
import { ref, watch } from 'vue'
import BusinessEntity from '../models/business-entity'
import useBusinessEntityVariables from '../composables/use-business-entity-variables'

const props = defineProps({
  show: Boolean,
  isAdd: {
    type: Boolean,
    default: true,
  },
  businessEntity: Object,
})

const emit = defineEmits(['onClose', 'onSubmit'])

// stores
const businessEntityStore = useBusinessEntityStore()
const useForm = Form.useForm

// states
const loading = ref(false)
const businessEntityCurrent = ref(props.businessEntity)

// composables
const { rules } = useBusinessEntityVariables()
const { resetFields, validate, validateInfos } = useForm(businessEntityCurrent, rules)

// functions
const onSave = () => {
  validate()
    .then(() => {
      loading.value = true
      if (props.isAdd) {
        businessEntityStore
          .add(businessEntityCurrent.value)
          .then(response => {
            emit('onSubmit', response.name, false)
            resetFields()
            message.success('Entidad agregado')
          })
          .catch(e => {
            message.error(`Detalle de error: ${e}`)
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        businessEntityStore
          .update(businessEntityCurrent.value)
          .then(response => {
            close()
            message.success('Entidad editado')
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
