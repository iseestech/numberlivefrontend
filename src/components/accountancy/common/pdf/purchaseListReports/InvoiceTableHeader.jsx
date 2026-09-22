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
    width: '12%',
    // borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  productName: {
    // width: '20%',
    width: '14%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  description: {
    // width: '20%',
    width: '14%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  qty: {
    // width: '15%',
    width: '12%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  rate: {
    // width: '15%',
    width: '12%',

    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  unitPrice: {
    // width: '15%',
    width: '12%',

    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  amount: {
    width: '12%',
  },
  account: {
    width: '12%',
  },
  discount: {
    width: '12%',
  },
  colWid: {
    width: '20%',
  },
  srNo: {
    width: '5%',
    textAlign: 'center',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    paddingLeft: 8,
  },
})

const InvoiceTableHeader = salesValue => {
  // console.log(salesValue,"salesValuesalesValue")
  // const headerKey = salesValue.includes("Invoice") ? "salesValue === 'Purchase Order' ? (
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.srNo}># </Text>
        <Text style={styles.colWid}>Purchase No#</Text>
        <Text style={styles.colWid}>Reference</Text>
        <Text style={styles.colWid}>Vendor Name</Text>
        <Text style={styles.colWid}>Order Date</Text>
        <Text style={styles.colWid}>Amount</Text>
        {/* <Text style={styles.colWid}>Status</Text>  */}
      </View>
    </>
  )
  // ) : return
}

export default InvoiceTableHeader
