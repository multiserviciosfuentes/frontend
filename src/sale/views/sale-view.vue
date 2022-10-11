<template>
  <invoice-component title="VENTAS" :type="EType.sale"></invoice-component>
</template>

<script setup>
import InvoiceComponent from '../components/invoice-component.vue'
import { EType } from '@/shared/enums'
</script>

<style lang="less" scoped></style>
