<template>
  <div>
    <a-select
      v-model:value="value"
      show-search
      placeholder="input search text"
      style="width: 200px"
      :default-active-first-option="false"
      :show-arrow="false"
      :filter-option="false"
      :not-found-content="null"
      :options="repositoriesSearchQuery"
      :field-names="{
        label: 'name',
        value: 'name',
      }"
      @search="handleSearch"
      @change="handleChange"
    ></a-select>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, watch } from 'vue'
import useProducts from '@/catalog/composables/use-products'
import useProductsNameSearch from '@/catalog/composables/use-products-name-search'

const value = ref()

const { products } = useProducts()
const { repositoriesSearchQuery, searchQuery } = useProductsNameSearch(products)

const handleSearch = val => {
  searchQuery.value = val
}

const handleChange = val => {
  value.value = val
  searchQuery.value = val
}
</script>

<style lang="less" scoped></style>
