import { ETypeMovement } from '@/shared/enums'
import { useMovementStore } from '@/stores/movement-store'
import { computed, ref } from 'vue'

export default function useMovementsByProduct(movements) {
  const getAllByProductId = productId => {
    return movements.value.filter(movement => {
      if (movement.direct !== null) {
        return movement.direct.product.id === productId
      } else {
        return movement.invoice.invoiceDetails.filter(invoiceDetail => invoiceDetail.product.id === productId)
      }
    })
  }

  const stockByProductId = productId => {
    let inputDirect = 0
    let outputDirect = 0
    let outputInvoice = 0

    inputDirect = movements.value
      .filter(movement => movement.type === ETypeMovement.input && movement.direct !== null)
      .filter(mfil => mfil.direct.product.id === productId)
      .reduce((x, item) => x + item.direct.quantity, 0)

    outputDirect = movements.value
      .filter(movement => movement.type === ETypeMovement.output && movement.direct !== null)
      .filter(mfil => mfil.direct.product.id === productId)
      .reduce((x, item) => x + item.direct.quantity, 0)

    outputInvoice = movements.value
      .filter(movement => movement.type === ETypeMovement.output && movement.invoice !== null)
      .filter(movement => movement.invoice.invoiceDetails.some(invoiceDetail => invoiceDetail.product.id === productId))
      .map(
        movement => movement.invoice.invoiceDetails.filter(invoiceDetail => invoiceDetail.product.id === productId)[0]
      )
      .reduce((x, invoiceDetail) => x + invoiceDetail.quantity, 0)
    return inputDirect - outputDirect - outputInvoice
  }

  return {
    getAllByProductId,
    stockByProductId,
  }
}
