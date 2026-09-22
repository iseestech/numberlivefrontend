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
    width: '15%',
    textAlign: 'left',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    paddingLeft: 8,
  },
  productName: {
    display: 'flex',
    flexDirection: 'row',
    width: '20%',
    textAlign: 'left',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    paddingLeft: 8,
    maxLines: 2,
  },
  description: {
    display: 'flex',
    flexDirection: 'row',
    width: '20%',
    textAlign: 'left',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    paddingLeft: 8,
    maxLines: 2,
  },
  qty: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    textAlign: 'right',
    paddingRight: 8,
  },
  rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    textAlign: 'right',
    paddingRight: 8,
  },
  amount: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
  discount: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
  unitPrice: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
  account: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
})

const InvoiceTableRow = ({ items }) => {
  // console.log(items, 'items')
  const rows = items.map(item => (
    <View style={styles.row} key={item.id}>
      <Text style={styles.item}>{item.product_code}</Text>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.description}>{item.sale_desc}</Text>
      <Text style={styles.qty}>{item.sale_qty}</Text>
      <Text style={styles.unitPrice}>{item.sale_unit_price}</Text>
      <Text style={styles.account}>{item.saleDiscountPercent}</Text>
      <Text style={styles.rate}>{item.sale_tax_rate}</Text>
      <Text style={styles.amount}>{item.sale_amount ? item.sale_amount.toFixed(2) : '-'}</Text>
    </View>
  ))
  return <Fragment>{rows}</Fragment>
}

export default InvoiceTableRow
