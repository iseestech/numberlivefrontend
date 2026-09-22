import React from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: 'lightgrey',
    backgroundColor: '#EEF2F5',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 40,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    flexGrow: 1,
  },
  item: {
    width: '15%',
    // borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  productName: {
    width: '20%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  description: {
    width: '20%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  qty: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  unitPrice: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  date: {
    width: '20%',
  },
  srNo: {
    width: '20%',
  },
  amount: {
    width: '20%',
  },
  dueAmount: {
    width: '20%',
  },
  payment: {
    width: '20%',
  },
})

const InvoiceTableHeader = salesValue => {
  // salesValue === 'Invoice' || salesValue === 'Purchase Order' ? (
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.srNo}>Invoive #</Text>
        <Text style={styles.date}>Invoice Date</Text>
        <Text style={styles.amount}>Invoice Amount</Text>
        <Text style={styles.dueAmount}>Amount Due</Text>
        <Text style={styles.payment}>Payment</Text>
      </View>
    </>
  )
  // ) : return
}

export default InvoiceTableHeader
