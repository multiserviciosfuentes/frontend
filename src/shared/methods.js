import moment from 'moment'
import _ from 'lodash'

export const dateParse = date => {
  if (date != null) return moment(date).format('DD/MM/YYYY')
  else return null
}

export const calcRode = (quantity, price, discount, decimals = 3) => {
  try {
    quantity = parseInt(quantity)
    price = _.round(parseFloat(price), decimals)
    discount = discount !== '' || discount != null ? parseFloat(discount) : NaN
    let result = quantity * price

    if (!isNaN(discount)) {
      result = _.round(result * (1 - discount / 100), decimals)
    } else result = _.round(result, decimals)

    return result
  } catch (e) {
    console.log(e)
  }
}

const digitsRE = /(\d{3})(?=\d)/g
export const currency = (value, currency, decimals) => {
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  currency = currency != null ? currency : '$'
  decimals = decimals != null ? decimals : 2
  var stringified = Math.abs(value).toFixed(decimals)
  var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified
  var i = _int.length % 3
  var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : ''
  var _float = decimals ? stringified.slice(-1 - decimals) : ''
  var sign = value < 0 ? '-' : ''
  return sign + currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float
}

function formatNumber(value) {
  value += ''
  const list = value.split('.')
  const prefix = list[0].charAt(0) === '-' ? '-' : ''
  let num = prefix ? list[0].slice(1) : list[0]
  let result = ''

  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`
    num = num.slice(0, num.length - 3)
  }

  if (num) {
    result = num + result
  }

  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`
}
