import { calcRode, currency, dateParse } from '@/shared/methods'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import dayjs from 'dayjs'
import { ETypeMovement } from '@/shared/enums'

dayjs.locale('es')

export default function useQuotationPrint() {
  const onPrint = ({ title, movements }) => {
    const doc = new jsPDF()

    autoTable(doc, {
      body: [
        [
          {
            content: `Reporte: ${title}`,
            styles: {
              fontStyle: 'bold',
            },
          },
          {
            content: dayjs().format('DD/MM/YYYY'),
            styles: {
              halign: 'right',
              fontSize: 8,
            },
          },
        ],
      ],
      theme: 'plain',
    })

    autoTable(doc, {
      headStyles: {
        // fillColor: '#A6A6A6',
        // textColor: '#C00000',
        halign: 'center',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7.5,
        cellPadding: 1,
      },

      columns: ['ITEM', 'FECHA', 'USUARIO', 'TIPO', 'FORMA', 'DESCRIPCIÓN', 'ENTRADA', 'SALIDA'],
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'center', cellWidth: 15 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 28 },
        6: { halign: 'center', cellWidth: 17 },
        7: { halign: 'center', cellWidth: 15 },
      },
      body: Array.from(movements, (item, index) => [
        index + 1,
        dateParse(item.createdAt),
        item.user.username,
        item.type === ETypeMovement.input ? 'ENTRADA' : 'SALIDA',
        item.form,
        item.description,
        item.type === ETypeMovement.input ? item.quantity : '-',
        item.type === ETypeMovement.output ? item.quantity : '-',
      ]),

      footStyles: {
        halign: 'center',
        fontSize: 8,
        // fillColor: '#A6A6A6',
        // textColor: '#252525',
      },
      foot: [
        [
          '',
          '',
          '',
          '',
          '',
          '',
          movements.filter(item => item.type === ETypeMovement.input).reduce((x, item) => x + item.quantity, 0),
          movements.filter(item => item.type === ETypeMovement.output).reduce((x, item) => x + item.quantity, 0),
        ],
      ],

      margin: { top: 40 },

      theme: 'striped',
    })

    return doc.save(`reporte_${dayjs().format('DDMMYYYYHHmmss')}`)
  }

  return {
    onPrint,
  }
}
