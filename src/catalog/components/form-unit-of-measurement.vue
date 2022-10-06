<template>
  <a-modal
    :visible="show"
    title="Agregar unidad de medida"
    @ok="handleOk"
    @cancel="$emit('onClose')"
    @confirm-loading="loading"
  >
    <a-form name="dynamic_rule">
      <a-form-item label="Nombre" name="username" v-bind="validateInfos.name">
        <a-input v-model:value="unitOfMeasurement.name" placeholder="Nombre" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { useUnitOfMeasurementStore } from '@/stores/unit-of-measurement-store'
import { Form, message } from 'ant-design-vue'
import { reactive, ref } from 'vue'
import UnitOfMeasurement from '../models/unit-of-measurement'

const props = defineProps({
  show: Boolean,
})

const emit = defineEmits(['onSubmit', 'onClose'])

const unitOfMeasurement = ref(new UnitOfMeasurement())
const unitOfMeasurementStore = useUnitOfMeasurementStore()
const rules = reactive({
  name: [
    {
      required: true,
      message: 'Ingresar nombre',
    },
  ],
})

const useForm = Form.useForm
const { resetFields, validate, validateInfos } = useForm(unitOfMeasurement, rules)

const loading = ref(false)

const handleOk = () => {
  validate()
    .then(() => {
      loading.value = true
      unitOfMeasurementStore
        .add(unitOfMeasurement.value)
        .then(response => {
          resetFields()
          message.success('Se agregó exitosamente')
          emit('onSubmit', response.name)
          emit('onClose')
        })
        .catch(err => {
          message.error(err)
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style lang="less" scoped></style>
