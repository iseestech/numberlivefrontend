import React, { Fragment } from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'
import moment from 'moment'
import HelperFunction from '@/services/helper'
import TableHeaderJSON from './tableHeader.json'

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    textAlign: 'center',
    maxLines: 3,
    maxHeight: 50,
    paddingTop: 5,
    // fontStyle: 'bold',
    fontWeight: 'bold',
  },
  srNo: {
    width: '5%',
    // textAlign: 'left',
    // borderRightColor: borderColor,
    // borderRightWidth: 0,
    // paddingLeft: 5,
  },

  col: {
    // width: '15%',
    width: '20%',
    alignItems: 'center',
    // paddingRight: 8,
  },
})

const InvoiceTableRow = ({ items, salesValue, flag }) => {
  // console.log(items, 'items', flag, salesValue, 'TableHeaderJSON', TableHeaderJSON[flag])
  let rows = []
  if (salesValue.includes('Chart Of Accounts1')) {
    rows = items.map((item, index) => (
      <View style={styles.row} key={item.id}>
        <Text style={styles.srNo}>{index + 1}</Text>
        <Text style={styles.col}>{item.actCode}</Text>
        <Text style={styles.col}>{item.actname}</Text>
        <Text style={styles.col}>{item.subgroup}</Text>
        {/* <Text style={styles.col}>{HelperFunction.dateFormatted(item.poDate)}</Text> */}
        <Text style={styles.col}>{item.primarygroup}</Text>
        <Text style={styles.col}>{item.natureofaccount}</Text>
        {/* <Text style={styles.col}>{item.accept_status}</Text> */}
      </View>
    ))
  } else {
    rows = items.map((item, index) => (
      <View style={styles.row} key={item.id}>
        <Text style={styles.srNo}>{index + 1}</Text>
        {TableHeaderJSON[flag] !== undefined &&
          TableHeaderJSON[flag].map((ele, i) => {
            // console.log(ele.name, 'ele name')
            const fieldText =
              ele.name === 'Date' ||
              ele.name === 'Order Date' ||
              ele.name === 'Purchase Date' ||
              ele.name === 'Expiry'
                ? moment(item[ele.value]).format('DD MMM YYYY')
                : item[ele.value]
            return (
              <Text style={ele.css || styles.col} key={ele.name}>
                {fieldText || '-'}
              </Text>
            )
          })}
      </View>
    ))
  }
  return <Fragment>{rows}</Fragment>
}

export default InvoiceTableRow
