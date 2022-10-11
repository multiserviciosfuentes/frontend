<template>
  <invoice-component title="ORDENES DE COMPRA" :type="EType.buy"></invoice-component>
</template>

<script setup>
import InvoiceComponent from '@/sale/components/invoice-component.vue'
import { EType } from '@/shared/enums'
</script>

<style lang="less" scoped></style>
