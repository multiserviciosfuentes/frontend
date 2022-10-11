import moment from 'moment'
import { calcRode, currency, dateParse } from '@/shared/methods'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { numeroALetras } from '@/shared/utils/numero-a-letras'
import _, { range } from 'lodash'
import dayjs from 'dayjs'
import { es } from 'dayjs/locale/es'
import Logo from '@/assets/images/local/fuentes2.jpeg'
import LogoBcp from '@/assets/images/local/logobcp.jpg'
import LogoBvva from '@/assets/images/local/logobbva.png'
import { ETypeCurrency } from '@/shared/enums'

dayjs.locale('es')

export default function useQuotationPrint() {
  const onPrint = saleOrder => {
    const doc = new jsPDF()


    autoTable(doc, {
      body: [
        [
          {
            content: 'Presente.-',
            styles: {
              fontSize: 9,
            },
          },
        ],
        [
          {
            content: `Atte. ${saleOrder.contact != null ? saleOrder.contact.fullName : '-'}`,
            styles: {
              fontSize: 9,
            },
          },
        ],
      ],

      styles: {
        cellPadding: 0.5,
      },
      theme: 'plain',
    })


    autoTable(doc, {
      columns: [
        'ITEM',
        'DESCRIPCIÓN',
        'CANT.',
        'UNIDAD MEDIDA',
        `MONTO UNIT. (${saleOrder.typeCurrency === ETypeCurrency.soles ? 'S/' : '$'})`,
        `TOTAL (${saleOrder.typeCurrency === ETypeCurrency.soles ? 'S/' : '$'})`,
      ],
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: {},
        2: { halign: 'center', cellWidth: 12 },
        3: { halign: 'center', cellWidth: 27 },
        4: { halign: 'right', cellWidth: 28 },
        5: { halign: 'right', cellWidth: 28 },
      },
      headStyles: {
        fillColor: '#A6A6A6',
        halign: 'center',
        textColor: '#C00000',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7.5,
        cellPadding: 1,
      },
      footStyles: {
        halign: 'right',
        fontSize: 8,
        fillColor: '#A6A6A6',
        textColor: '#252525',
      },
      body: Array.from(saleOrder.invoiceDetails, (item, index) => [
        index + 1,
        item.description,
        item.quantity,
        item.unitOfMeasurement.name,
        item.price,
        saleOrder.total,
      ]),


      // foot: [['', '', '', '', 'Sub Total', `${currency(saleOrder.total, preTypeCurrency, 2)}`]],

      margin: { top: 40 },

      theme: 'grid',
    })

    autoTable(doc, {
      body: [
        {
          content: `SON: ${numeroALetras(saleOrder.total, saleOrder.typeCurrency)}`,
        },
      ],

      styles: {
        fontSize: 8,
        fontStyle: 'bold',
      },

      theme: 'plain',
    })


    return doc.save(`cotización`)
  }

  return {
    onPrint,
  }
}
