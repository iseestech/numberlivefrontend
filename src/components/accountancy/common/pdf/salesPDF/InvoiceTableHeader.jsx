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
    textAlign: 'left',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    // flexGrow: 1,
  },
  item: {
    width: '10%',
    // borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  productName: {
    width: '30%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  description: {
    width: '30%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  rate: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  unitPrice: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  amount: {
    width: '10%',
  },
  account: {
    width: '10%',
  },
  discount: {
    width: '10%',
  },
  colWid: {
    width: '10%',
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
  // salesValue === 'Invoice' || salesValue === 'Purchase Order' ? (
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.srNo}>#</Text>
        <Text style={styles.item}>Code</Text>
        <Text style={styles.productName}>Name and Description</Text>
        {/* <Text style={styles.description}>Description</Text> */}
        <Text style={styles.qty}>Quantity</Text>
        <Text style={styles.unitPrice}>Price</Text>
        <Text style={styles.discount}>Discount (%)</Text>
        {/* <Text style={styles.account}>Account</Text> */}
        <Text style={styles.rate}>Tax Rate</Text>
        <Text style={styles.amount}>Amount</Text>
      </View>
    </>
  )
  // ) : return
}

export default InvoiceTableHeader
