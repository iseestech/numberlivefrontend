import React, { Fragment } from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'
import HelperFunction from '@/services/helper'

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontWeight: 'bold',
  },
  item: {
    width: '12%',
    textAlign: 'center',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    paddingLeft: 8,
  },
  srNo: {
    width: '5%',
    textAlign: 'center',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    paddingLeft: 8,
  },

  productName: {
    display: 'flex',
    flexDirection: 'row',
    width: '14%',
    textAlign: 'center',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    paddingLeft: 8,
    maxLines: 2,
  },
  description: {
    display: 'flex',
    flexDirection: 'row',
    width: '14%',
    textAlign: 'center',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    paddingLeft: 8,
    maxLines: 2,
  },
  qty: {
    display: 'flex',
    flexDirection: 'row',
    width: '16%',
    textAlign: 'center',
    borderRightColor: borderColor,
    // borderRightWidth: 0,
    // paddingLeft: 8,
    // paddingRight: 8,
  },
  rate: {
    // width: '15%',
    width: '16%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    textAlign: 'center',
    // paddingRight: 8,
  },
  amount: {
    // width: '15%',
    width: '12%',
    textAlign: 'center',
    // paddingRight: 8,
  },
  discount: {
    // width: '15%',
    width: '12%',
    textAlign: 'center',
    // paddingRight: 8,
  },
  unitPrice: {
    // width: '15%',
    width: '12%',
    textAlign: 'center',
    // paddingRight: 8,
  },
  col: {
    // width: '15%',
    width: '20%',
    textAlign: 'center',
    // paddingRight: 8,
  },
})

const InvoiceTableRow = ({ items, salesValue }) => {
  // console.log(items, 'items')
  let rows = []
  if (salesValue.includes('Order')) {
    rows = items.map((item, index) => (
      <View style={styles.row} key={item.id}>
        <Text style={styles.srNo}>{index + 1}</Text>
        <Text style={styles.col}>{item.purchase_order_no}</Text>
        <Text style={styles.col}>{item.reference}</Text>
        <Text style={styles.col}>{item.vendorName}</Text>
        <Text style={styles.col}>{HelperFunction.dateFormatted(item.poDate)}</Text>
        <Text style={styles.col}>{item.amount}</Text>
        {/* <Text style={styles.col}>{item.accept_status}</Text> */}
      </View>
    ))
  } else {
    rows = items.map((item, index) => (
      <View style={styles.row} key={item.id}>
        <Text style={styles.srNo}>{index + 1}</Text>
        <Text style={styles.col}>{item.invoice_no}</Text>
        {/* <Text style={styles.col}>{item.reference}</Text> */}
        <Text style={styles.col}>{item.vendor_name}</Text>
        <Text style={styles.col}>{HelperFunction.dateFormatted(item.purchaseDate)}</Text>
        <Text style={styles.col}>{item.payment_status}</Text>
        <Text style={styles.col}>{item.total}</Text>
        {/* <Text style={styles.col}>{item.accept_status}</Text> */}
      </View>
    ))
  }
  return <Fragment>{rows}</Fragment>
}

export default InvoiceTableRow
