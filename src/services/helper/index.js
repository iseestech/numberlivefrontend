import apiClient from '@/services/axios'
import queryString from 'query-string'
import moment from 'moment'
import _ from 'lodash'
import store from 'store'

const HelperFunction = {
  dateFormatted: date => {
    if (date !== undefined && date !== '') {
      const newDate = new Date(date)
      const month = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ][newDate.getMonth()]
      // const str = `${newDate.getDate()} ${month} ${newDate.getFullYear()}`
      const str = moment(date).format('DD MMM YYYY')
      return str
    }
    return ''
  },
  getCurrentDate: () => {
    let d = new Date()
    // 2021/01/01
    d = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
    return d
  },

  getDataForCSV: (data, column) => {
    // console.log(data, 'test', column)
    if (data === undefined || data === null || !data.length) {
      return []
    }
    const arr = []
    // let getHeader = Object.keys(data[0]);
    const getHeader = column.map(x => x.dataIndex)

    if (getHeader.indexOf('key') > -1) getHeader.splice(getHeader.indexOf('key'), 1)

    if (getHeader.indexOf('actions') > -1) getHeader.splice(getHeader.indexOf('actions'), 1)

    // console.log('getHeader', getHeader)
    arr.push(getHeader)
    const getBody = data.map(item => Object.values(_.pick(item, getHeader)))
    // console.log(getBody, 'getBodyCSV9999')
    arr.push(...getBody)
    // console.log(arr, 'getBodyCSV')
    return arr
  },

  getFilterdColumn: (data, column) => {
    if (data === undefined || data === null || !data.length) {
      return []
    }
    const getHeader = column.map(x => x.dataIndex)
    getHeader.unshift('srNo')
    const getBody = data.map((item, index) => {
      item.srNo = index + 1
      return _.pick(item, getHeader)
    })
    // console.log(getBody, 'getBody XLS')
    return getBody || []
  },
  sortTableColumn: (firstVal, secondVal, key, type) => {
    // console.log(firstVal, secondVal, key, type)
    if (firstVal[key] !== null) {
      if (type === 'string') {
        return firstVal[key].localeCompare(secondVal[key])
      }
      if (type === 'number') {
        return firstVal[key] - secondVal[key]
      }
      if (type === 'date') {
        return firstVal[key].localeCompare(secondVal[key])
      }
      return firstVal[key] === secondVal[key]
    }
    return firstVal[key] === secondVal[key]
  },
  isLoadingRequest: val => {
    // console.log('val', val)
    if (val) {
      document.getElementsByClassName('initial__loading')[0].style.display = 'block'
    } else {
      document.getElementsByClassName('initial__loading')[0].style.display = 'none'
    }
  },
  isValidNumNew: e => {
    const reg2 = /^(0|[1-9]\d*)(\.\d+)?$/
    const reg1 = /[^0-9.]+/g
    const val = e ? e.toString() : ''
    const dt = val ? val?.replace(reg1, '').split('.') : ''
    return dt.length > 1 ? `${dt[0]}.${dt[1]}` : dt[0]
  },
  isValidNumber: e => {
    // const regEx = /\d+/g
    const regEx = /^\d+$/
    const val = String.fromCharCode(e.keyCode)
    // if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 8 || e.keyCode === 190) {
    if (
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 96 && e.keyCode <= 105) ||
      e.keyCode === 8 ||
      e.keyCode === 190
    ) {
      return true
    }
    e.preventDefault()
    return false
  },
  isValidString: e => {
    const regEx = /^[a-zA-Z]*$/
    const val = String.fromCharCode(e.charCode)
    if (regEx.test(val) || e.charCode === 8 || e.charCode === 190 || e.charCode === 32) {
      return true
    }
    e.preventDefault()
    return false
  },
  isValidMobile: e => {
    const regEx = /\d+/g
    const val = String.fromCharCode(e.charCode)
    if (regEx.test(val) || e.charCode === 8) {
      return true
    }
    e.preventDefault()
    return false
  },
  renderCellAmt: e => {
    const selOrgData = store.get('selectedOrg')
    const value = Number(e?.value).toFixed(selOrgData?.decimals || 0) || ''
    return value
  },
}

export default HelperFunction
