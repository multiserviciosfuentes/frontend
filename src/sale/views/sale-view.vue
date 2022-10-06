<template>
  <invoice-component title="COMPROBANTES" :type="EType.sale"></invoice-component>
</template>

<script setup>
import InvoiceComponent from '../components/invoice-component.vue'
import { EType } from '@/shared/enums'
</script>

<style lang="less" scoped></style>
