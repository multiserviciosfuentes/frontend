import { ETypeCurrency, ETypeMovement } from '@/shared/enums'
import { computed } from 'vue'

export default function useMovementsByProduct(movements) {
  const getAllByProductId = productId => {
    return movements.value
      .filter(movement => {
        if (movement.direct !== null) {
          return movement.direct.product.id === productId
        } else {
          return movement.invoice.invoiceDetails.some(invoiceDetail => invoiceDetail.product.id === productId)
        }
      })
      .map(movement => {
        if (movement.direct !== null) {
          return {
            productId: movement.direct.product.id,
            createdAt: movement.createdAt,
            type: movement.type,
            user: movement.direct.user,
            form: 'DIRECTO',
            description: movement.description,
            quantity: movement.direct.quantity,
          }
        } else {
          let invoiceDetail = movement.invoice.invoiceDetails.filter(
            invoiceDetail => invoiceDetail.product.id === productId
          )[0]

          return {
            productId: invoiceDetail.product.id,
            createdAt: movement.createdAt,
            type: movement.type,
            user: movement.invoice.user,
            form:
              movement.invoice.numberSaleOrder !== null
                ? `O. DE VENTA: ${movement.invoice.numberSaleOrder}`
                : `O. DE COMPRA: ${movement.invoice.numberPurchaseOrder}`,
            description: movement.description,
            quantity: invoiceDetail.quantity,
          }
        }
      })
  }

  const stockByProductId = productId => {
    let inputDirect = 0
    let outputDirect = 0
    let inputInvoice = 0
    let outputInvoice = 0

    inputDirect = movements.value
      .filter(movement => movement.type === ETypeMovement.input && movement.direct !== null)
      .filter(mfil => mfil.direct.product.id === productId)
      .reduce((x, item) => x + item.direct.quantity, 0)

    outputDirect = movements.value
      .filter(movement => movement.type === ETypeMovement.output && movement.direct !== null)
      .filter(mfil => mfil.direct.product.id === productId)
      .reduce((x, item) => x + item.direct.quantity, 0)

    inputInvoice = movements.value
      .filter(movement => movement.type === ETypeMovement.input && movement.invoice !== null)
      .filter(movement => movement.invoice.invoiceDetails.some(invoiceDetail => invoiceDetail.product.id === productId))
      .map(
        movement => movement.invoice.invoiceDetails.filter(invoiceDetail => invoiceDetail.product.id === productId)[0]
      )
      .reduce((x, invoiceDetail) => x + invoiceDetail.quantity, 0)

    outputInvoice = movements.value
      .filter(movement => movement.type === ETypeMovement.output && movement.invoice !== null)
      .filter(movement => movement.invoice.invoiceDetails.some(invoiceDetail => invoiceDetail.product.id === productId))
      .map(
        movement => movement.invoice.invoiceDetails.filter(invoiceDetail => invoiceDetail.product.id === productId)[0]
      )
      .reduce((x, invoiceDetail) => x + invoiceDetail.quantity, 0)
    return inputDirect + inputInvoice - outputDirect - outputInvoice
  }

  const rodeSolesMovements = computed(() => {
    let totalInputDirect = movements.value
      .filter(movement => movement.type === ETypeMovement.input && movement.direct !== null)
      .filter(movement => movement.direct.product.typeCurrency === ETypeCurrency.soles)
      .reduce((x, item) => x + item.direct.quantity * item.direct.product.price, 0)

    let totalOutputDirect = movements.value
      .filter(movement => movement.type === ETypeMovement.output && movement.direct !== null)
      .filter(movement => movement.direct.product.typeCurrency === ETypeCurrency.soles)
      .reduce((x, item) => x + item.direct.quantity * item.direct.product.price, 0)

    let totalInputInvoice = movements.value
      .filter(movement => movement.type === ETypeMovement.input && movement.invoice !== null)
      .filter(movement => movement.invoice.typeCurrency === ETypeCurrency.soles)
      .map(movement =>
        movement.invoice.invoiceDetails.reduce(
          (x, invoiceDetail) => x + invoiceDetail.quantity * invoiceDetail.product.price,
          0
        )
      )
      .reduce((x, rode) => x + rode, 0)

    let totalOutputInvouce = movements.value
      .filter(movement => movement.type === ETypeMovement.output && movement.invoice !== null)
      .filter(movement => movement.invoice.typeCurrency === ETypeCurrency.soles)
      .map(movement =>
        movement.invoice.invoiceDetails.reduce(
          (x, invoiceDetail) => x + invoiceDetail.quantity * invoiceDetail.product.price,
          0
        )
      )
      .reduce((x, rode) => x + rode, 0)

    return totalInputDirect - totalOutputDirect + totalInputInvoice - totalOutputInvouce
  })

  const rodeDollarMovements = computed(() => {
    let totalInputDirect = movements.value
      .filter(movement => movement.type === ETypeMovement.input && movement.direct !== null)
      .filter(movement => movement.direct.product.typeCurrency === ETypeCurrency.dollar)
      .reduce((x, item) => x + item.direct.quantity * item.direct.product.price, 0)

    let totalOutputDirect = movements.value
      .filter(movement => movement.type === ETypeMovement.output && movement.direct !== null)
      .filter(movement => movement.direct.product.typeCurrency === ETypeCurrency.dollar)
      .reduce((x, item) => x + item.direct.quantity * item.direct.product.price, 0)

    let totalInputInvoice = movements.value
      .filter(movement => movement.type === ETypeMovement.input && movement.invoice !== null)
      .filter(movement => movement.invoice.typeCurrency === ETypeCurrency.dollar)
      .map(movement =>
        movement.invoice.invoiceDetails.reduce(
          (x, invoiceDetail) => x + invoiceDetail.quantity * invoiceDetail.product.price,
          0
        )
      )
      .reduce((x, rode) => x + rode, 0)

    let totalOutputInvouce = movements.value
      .filter(movement => movement.type === ETypeMovement.output && movement.invoice !== null)
      .filter(movement => movement.invoice.typeCurrency === ETypeCurrency.dollar)
      .map(movement =>
        movement.invoice.invoiceDetails.reduce(
          (x, invoiceDetail) => x + invoiceDetail.quantity * invoiceDetail.product.price,
          0
        )
      )
      .reduce((x, rode) => x + rode, 0)

    return totalInputDirect - totalOutputDirect + totalInputInvoice - totalOutputInvouce
  })

  return {
    getAllByProductId,
    stockByProductId,

    rodeDollarMovements,
    rodeSolesMovements,
  }
}
