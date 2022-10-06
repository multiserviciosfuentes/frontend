<template>
  <div>
    <a-drawer
      :title="isAdd ? 'Agregar producto' : 'Editar producto'"
      :placement="isAdd ? 'left' : 'right'"
      :width="720"
      :visible="show"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="$emit('onClose')"
      :maskClosable="false"
    >
      <a-form layout="vertical" ref="formRef" :model="productForm" :rules="rules">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item has-feedback label="Código" name="code">
              <a-input v-model:value="productForm.code" placeholder="Insertar código" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item has-feedback label="Nombre" name="name">
              <a-input v-model:value="productForm.name" placeholder="Insertar nombre" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item has-feedback label="Unidad de medida" name="unitOfMeasurement">
              <a-space :size="8">
                <a-select
                  v-model:value="productForm.unitOfMeasurement"
                  show-search
                  :style="{ width: '250px' }"
                  placeholder="Buscar unidad de medida"
                  :default-active-first-option="false"
                  :filter-option="false"
                  :not-found-content="null"
                  :options="repositoriesSearchQuery"
                  :field-names="{
                    label: 'name',
                    value: 'name',
                  }"
                  @search="handleUnitOfMeasurementSearch"
                  @change="handleUnitOfMeasurementChange"
                ></a-select>
                <a-button type="primary" @click="showModelAddUM = true"> + </a-button>
              </a-space>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Precio" name="price">
              <a-input type="number" :maxlength="9" v-model:value="productForm.price" placeholder="Insertar precio" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item
              v-for="(nickname, index) in productForm.nicknames"
              :key="nickname.key"
              v-bind="index === 0 ? formItemLayout : {}"
              :label="index === 0 ? 'Alias' : ''"
              :name="['nicknames', index, 'name']"
              :rules="{
                required: true,
                message: 'Alias no puede ser nulo',
                trigger: 'change',
              }"
            >
              <a-input
                v-model:value="nickname.name"
                placeholder="Insertar alias"
                :style="{ width: '60%', marginRight: '8px' }"
              />
              <MinusCircleOutlined
                v-if="productForm.nicknames.length > 0"
                class="dynamic-delete-button"
                @click="removeNickname(nickname)"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayoutWithOutLabel">
              <a-button type="dashed" style="width: 60%" @click="addNickname">
                <PlusOutlined />
                Agregar Alias
              </a-button>
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

    <template v-if="showModelAddUM">
      <form-unit-of-measurement
        :show="showModelAddUM"
        @on-submit="handleUnitOfMeasurementChange"
        @on-close="showModelAddUM = false"
      ></form-unit-of-measurement>
    </template>
  </div>
</template>

<script setup>
import { onUnmounted, reactive, ref, watch } from 'vue'
import { useProductStore } from '@/stores/product-store'
import { message } from 'ant-design-vue'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons-vue'
import { Form } from 'ant-design-vue'
import Product from '../models/product'
import useUnitOfMeasurement from '../composables/unit-of-measurements'
import useUnitOfMeasurementSearch from '../composables/unit-of-measurements-search'
import FormUnitOfMeasurement from './form-unit-of-measurement.vue'
import _ from 'lodash'

const props = defineProps({
  show: Boolean,
  isAdd: {
    type: Boolean,
    default: true,
  },
  product: Object,
})

const emit = defineEmits(['onClose', 'onSubmit'])

// for unit of measurement
const showModelAddUM = ref(false)
const { repositories } = useUnitOfMeasurement()
const { searchQuery, repositoriesSearchQuery } = useUnitOfMeasurementSearch(repositories)

const handleUnitOfMeasurementSearch = val => {
  searchQuery.value = val
}

const handleUnitOfMeasurementChange = name => {
  searchQuery.value = name
  productForm.value.unitOfMeasurement = name
}

// stores
const productStore = useProductStore()
const useForm = Form.useForm

// states
const productForm = ref(props.product)

const formRef = ref()
// rules
const rules = {
  code: [
    {
      required: true,
      message: 'Inserta un código',
    },
  ],
  name: [
    {
      required: true,
      message: 'Inserta un nombre',
    },
  ],
  unitOfMeasurement: [
    {
      required: true,
      message: 'Inserta una unidad de medida',
    },
  ],
}

// functions
const loading = ref(false)
const onSave = () => {
  formRef.value
    .validate()
    .then(() => {
      let objProduct = _.cloneDeep(productForm.value)
      objProduct.unitOfMeasurement = repositories.value.filter(x => x.name === objProduct.unitOfMeasurement)[0]
      loading.value = true
      if (props.isAdd) {
        productStore
          .add(objProduct)
          .then(response => {
            message.success('Producto agregado')
            emit('onSubmit', response.name, false)
            formRef.value.resetFields()
            searchQuery.value = ''
          })
          .catch(e => {
            message.error(`Detalle de error: ${e}`)
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        productStore
          .update(objProduct)
          .then(response => {
            close()
            message.success('Producto editado')
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

const removeNickname = item => {
  let index = productForm.value.nicknames.indexOf(item)

  if (index !== -1) {
    productForm.value.nicknames.splice(index, 1)
  }
}

const addNickname = () => {
  productForm.value.nicknames.push({
    name: '',
    key: Date.now(),
  })
}

const close = () => {
  emit('onClose')
}

// others
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 4,
    },
  },
}

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
  },
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
