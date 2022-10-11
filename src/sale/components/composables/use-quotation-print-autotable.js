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
  const onPrint = ({ igv, wayToPay, place, availability, quotation, user, validity }) => {
    const doc = new jsPDF()

    let preTypeCurrency = ETypeCurrency.soles === quotation.typeCurrency ? 'S/' : '$'

    let result = Array.from(quotation.invoiceDetails, (item, index) => [
      index + 1,
      item.description,
      item.quantity,
      item.product.unitOfMeasurement.name,
      `${currency(item.price, '', 3)}`,
      `${currency(calcRode(item.quantity, item.price, item.discount), '', 3)}`,
    ])

    if (quotation.invoiceDetails.length < 4) {
      result = [...result, [], [], []]
    }

    let currentDate = dayjs(quotation.dateVoucher)

    //   body: [
    //     [
    //       {
    //         content: 'Multiservicios Fuentes',
    //         styles: {
    //           halign: 'left',
    //           fontSize: 14,
    //         },
    //       },
    //       {
    //         content: [`Cotización #: ${quotation.numberQuotation}`],
    //         styles: {
    //           halign: 'right',
    //           fontSize: 14,
    //         },
    //       },
    //     ],
    //     [
    //       {
    //         content: `Mz.G Lt.6 Sec.1 Grupo 21A | Lima-Lima-Villa el salvador\nventas@multiserviciosfuentes.com\nwww.multiserviciosfuentes.com`,
    //         styles: {
    //           halign: 'left',
    //         },
    //       },
    //       {
    //         content: [`Fecha: ${moment(quotation.dateVoucher).format('DD/MM/YYYY')}`],
    //         styles: {
    //           halign: 'right',
    //         },
    //       },
    //     ],
    //   ],
    //   theme: 'plain',
    // })

    // autoTable(doc, {
    //   body: [
    //     [
    //       {
    //         content: `Emitida para: ${quotation.businessEntity.name}\nDirección: ${
    //           quotation.businessEntity.address != null ? quotation.businessEntity.address : '-'
    //         }\nContacto: ${quotation.contact != null ? quotation.contact.fullName : '-'} \nTeléfono: ${
    //           quotation.contact != null ? quotation.contact.phone : '-'
    //         }`,
    //         styles: {
    //           halign: 'left',
    //         },
    //       },
    //     ],
    //   ],
    //   theme: 'plain',
    // })
    autoTable(doc, {
      didDrawCell: data => {
        if (data.section === 'body' && data.column.index === 0) {
          var base64Img = 'data:image/jpeg;base64,iVBORw0KGgoAAAANS...'
          doc.addImage(Logo, 'JPEG', data.cell.x + 2, data.cell.y + 2, 40, 20)
        }
      },

      body: [
        [
          {
            content: `Mz.G Lt.6 Sec.1 Grupo 21A\nLima-Lima-Villa el salvador\nRUC: 20605464425`,
            styles: {
              fontSize: 8,
              halign: 'right',
              textColor: '#C00000',
              fontStyle: 'bold',
            },
          },
        ],
      ],

      styles: {
        minCellHeight: 10,
      },

      theme: 'plain',
    })

    autoTable(doc, {
      body: [
        [
          {
            content: '',
            rowSpan: 20,
            styles: {
              fontSize: 9,
            },
          },
        ],
      ],
      theme: 'plain',
    })

    autoTable(doc, {
      body: [
        [
          {
            content: `Señores:`,
            styles: {
              fontSize: 8,
              halign: 'left',
            },
          },
          {
            content: `Lima, ${_.padStart(currentDate.date(), 2, '0')} de ${_.capitalize(
              dayjs.months().at(currentDate.month() - 1)
            )} de ${currentDate.year()}`,
            styles: {
              fontSize: 8,
              halign: 'right',
            },
          },
        ],
        [
          {
            content: `${quotation.businessEntity.name}`,
            styles: {
              fontSize: 8,
              fontStyle: 'bold',
              halign: 'left',
            },
          },
          {
            content: `COT.${_.padStart(quotation.numberQuotation, 6, '0')}`,
            styles: {
              fontSize: 8,
              fontStyle: 'bold',
              halign: 'right',
            },
          },
        ],
        [
          {
            content: `RUC: ${quotation.businessEntity.identityNumber}`,
            styles: {
              fontSize: 8,
              fontStyle: 'bold',
              halign: 'left',
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
            content: `Atte. ${quotation.contact != null ? quotation.contact.fullName : '-'}`,
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
      body: [
        [
          {
            content: 'Le hacemos llegar la siguiente cotización',
            // colSpan: 20,
            rowSpan: 20,
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
        `MONTO UNIT. (${preTypeCurrency})`,
        `TOTAL (${preTypeCurrency})`,
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
      body: result,
      foot: [['', '', '', '', 'Sub Total', `${currency(quotation.total, preTypeCurrency, 2)}`]],

      margin: { top: 40 },

      theme: 'grid',
    })

    autoTable(doc, {
      body: [
        {
          content: `SON: ${numeroALetras(quotation.total, quotation.typeCurrency)}`,
        },
      ],

      styles: {
        fontSize: 8,
        fontStyle: 'bold',
      },

      theme: 'plain',
    })

    autoTable(doc, {
      didDrawCell: data => {
        if (data.section === 'body' && data.column.index === 0 && data.row.index === 5) {
          doc.addImage(LogoBcp, 'JPEG', data.cell.x, data.cell.y, 10, 3)
        }

        if (data.section === 'body' && data.column.index === 0 && data.row.index === 7) {
          doc.addImage(LogoBvva, 'JPEG', data.cell.x, data.cell.y, 10, 4)
        }
      },
      body: [
        [
          {
            content: `Condiciones de venta:`,
            styles: {
              fontSize: 8.5,
              fontStyle: 'bold',
              cellPadding: { bottom: 0, left: 15 },
            },
          },
        ],
        [
          {
            content: 'Precio no incluye IGV',
            styles: {
              fontSize: 9,
              fontStyle: 'italic',
              textColor: '#FF0000',
              // fillColor: '#FFFF00',
              cellPadding: { bottom: 0, left: 15 },
              halign: 'left',
            },
          },
        ],
        [
          {
            content: `Forma de pago: ${wayToPay}\nLugar de entrega: ${place}\nDisponibilidad : ${availability}\nValidez de la cotización ${validity}.`,

            styles: {
              fontSize: 8,
              cellPadding: { bottom: 5, left: 15 },
            },
          },
        ],
        [
          {
            content: `Cuentas Bancarias:`,
            styles: {
              fontSize: 8.5,
              fontStyle: 'bold',
              cellPadding: { bottom: 0, left: 15 },
            },
          },
        ],
        [
          {
            content: `Banco de Credito del Peru`,
            styles: {
              fontSize: 8.5,
              fontStyle: 'bold',
              cellPadding: { bottom: 0, left: 15 },
            },
          },
        ],
        [
          {
            content: `Banco de Credito del Peru N° de Cta.Cte. Soles : 194-99928811-0-90\nBanco de Credito del Peru N° de Cta.Cte Dolares: 194-2642154-1-33`,
            styles: {
              fontSize: 8,
              cellPadding: { bottom: 0, left: 15 },
            },
          },
        ],
        [
          {
            content: `Banco Continental BBVA`,
            styles: {
              fontSize: 8.5,
              fontStyle: 'bold',
              cellPadding: { bottom: 0, left: 15 },
            },
          },
        ],
        [
          {
            content: `Banco continental del Peru N° de Cta.Cte. Soles : 0011-0135-010005917117\nBanco continental del Peru N° de Cta.Cte. Dolares (CCI): 0011-0135-010005919810`,
            styles: {
              fontSize: 8,
              cellPadding: { bottom: 5, left: 15 },
            },
          },
        ],
        [
          {
            content: 'Agradeciendo de antemano la confianza puesta en nosotros, quedamos de Ud\n\n\nAtentamente,',
            styles: {
              fontSize: 9,
              cellPadding: 1,
            },
          },
        ],
      ],
      styles: {
        cellPadding: { top: 0, bottom: 0, left: 1, right: 0 },
      },

      theme: 'plain',
    })

    autoTable(doc, {
      body: [
        [
          {
            content: `${_.join(
              _.split(user.fullName, ' ').map(item => _.capitalize(item)),
              ' '
            )}`,
            styles: {
              fontSize: 7.5,
              fontStyle: 'bold',
            },
          },
        ],
        [
          {
            content: 'Multiservicios Fuentes E.I.R.L',
            styles: {
              fontSize: 7.5,
            },
          },
        ],
        [
          {
            content: 'Asesor de ventas',
            styles: {
              fontSize: 7.5,
            },
          },
        ],
        [
          {
            content: `Celular: ${user.phone != null ? user.phone : '-'}`,
            styles: {
              fontSize: 7.5,

              fontStyle: 'bold',
            },
          },
        ],
        [
          {
            content: `Email: ${user.email != null ? user.email : '-'}`,
            styles: {
              fontSize: 7.5,

              fontStyle: 'bold',
            },
          },
        ],
      ],

      styles: {
        cellPadding: 0.3,
      },

      theme: 'plain',
    })
    return doc.save(`cotización-${quotation.numberQuotation}`)
  }

  return {
    onPrint,
  }
}
