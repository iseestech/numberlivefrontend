import React, { Fragment } from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
  },
  item: {
    width: '12%',
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
    width: '12%',
    textAlign: 'center',
    borderRightColor: borderColor,
    // borderRightWidth: 0,
    // paddingLeft: 8,
    // paddingRight: 8,
  },
  rate: {
    // width: '15%',
    width: '12%',
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
  srNo: {
    width: '5%',
    textAlign: 'center',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    paddingLeft: 8,
  },
})

const InvoiceTableRow = ({ items }) => {
  const rows = items.map((item, index) => (
    <View style={styles.row} key={item.id}>
      <Text style={styles.srNo}>{index + 1}</Text>
      <Text style={styles.item}>{item.product_code}</Text>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.description}>{item.purchase_desc}</Text>
      <Text style={styles.qty}>{item.purchase_qty}</Text>
      <Text style={styles.unitPrice}>{item.purchase_unit_price}</Text>
      <Text style={styles.discount}>{item.purchase_discount}</Text>
      <Text style={styles.account}>{item.purchase_account}</Text>
      <Text style={styles.rate}>{item.purchase_tax_rate}</Text>
      <Text style={styles.amount}>
        {item.purchase_amount ? item.purchase_amount.toFixed(2) : '-'}
      </Text>
    </View>
  ))
  return <Fragment>{rows}</Fragment>
}

export default InvoiceTableRow
