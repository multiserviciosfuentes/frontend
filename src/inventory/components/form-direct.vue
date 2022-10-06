<template>
  <a-modal
    :visible="show"
    title="Agregar o quitar producto"
    ok-text="Aceptar"
    cancel-text="Cancelar"
    @ok="onOk"
    @cancel="$emit('onClose')"
    :confirm-loading="loading"
  >
    <a-form ref="formRef" :model="formDirect" layout="vertical" name="typeMovement">
      <a-form-item name="product" label="Producto">
        <span class="ant-form-text">{{ product.name }}</span>
      </a-form-item>

      <a-form-item name="typeMovement">
        <a-radio-group v-model:value="formDirect.typeMovement">
          <a-radio :value="ETypeMovement.input">Agregar</a-radio>
          <a-radio :value="ETypeMovement.output">Quitar</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item name="quantity" label="Cantidad" :rules="[{ required: true, message: 'Agregar cantidad' }]">
        <a-input type="number" v-model:value="formDirect.quantity" />
      </a-form-item>

      <a-form-item name="description" label="Descripción" :rules="[{ required: true, message: 'Agregar descripción' }]">
        <a-input v-model:value="formDirect.description" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { reactive, ref, toRaw, watch } from 'vue'
import { ETypeMovement } from '@/shared/enums'
import { useAuthUserStore } from '@/stores/auth-user-store'
import { useDirectStore } from '@/stores/direct-store'
import { message } from 'ant-design-vue'

const props = defineProps({
  show: Boolean,
  product: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['onClose'])

const authStore = useAuthUserStore()
const directStore = useDirectStore()

const formRef = ref()
const loading = ref(false)
const formDirect = reactive({
  typeMovement: ETypeMovement.input,

  description: 'Agregado directo',
  quantity: '',

  product: props.product,
  movement: null,
  user: { id: authStore.userCurrent.id },
})

watch(
  () => formDirect.typeMovement,
  resulta => {
    if (resulta === ETypeMovement.input) {
      formDirect.description = 'Agregado directo'
    } else {
      formDirect.description = 'Removido directo'
    }
  }
)

const onOk = () => {
  formRef.value
    .validateFields()
    .then(values => {
      loading.value = true
      formDirect.movement = { type: formDirect.typeMovement, description: formDirect.description.toUpperCase() }
      directStore
        .add(formDirect)
        .then(response => {
          message.success('Producto agregado')
          formRef.value.resetFields()
          emit('onClose')
        })
        .catch(err => {
          message.error(err)
        })
        .finally(() => {
          loading.value = false
        })
    })
    .catch(info => {
      console.log('Validate Failed:', info)
    })
}
</script>

<style lang="less" scoped></style>
