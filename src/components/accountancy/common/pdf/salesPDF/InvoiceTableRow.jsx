import React, { Fragment } from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    alignItems: 'center',
    fontWeight: 'bold',
  },
  item: {
    width: '10%',
    textAlign: 'left',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: '12px',
    textTransform: 'capitalize',
  },
  description: {
    // display: 'flex',
    // flexDirection: 'row',
    width: '30%',
    textAlign: 'left',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    padding: '12px',
    fontSize: '8px',
    marginRight: '4px',
    // maxLines: 2,
    wordBreak: 'breakAll',
    // overflowWrap: "breakWord",
    // hyphens: "manual"
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    textAlign: 'left',
  },
  rate: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 0,
    textAlign: 'left',
  },
  amount: {
    width: '10%',
    textAlign: 'left',
  },
  discount: {
    width: '10%',
    textAlign: 'left',
  },
  unitPrice: {
    width: '10%',
    textAlign: 'left',
  },
  account: {
    width: '10%',
    textAlign: 'left',
  },
  srNo: {
    width: '5%',
    textAlign: 'left',
    borderRightColor: borderColor,
    borderRightWidth: 0,
  },
})

const InvoiceTableRow = ({ items }) => {
  // console.log(items, 'items')
  const rows = items.map((item, index) => (
    <View style={styles.row} key={item.id}>
      <Text style={styles.srNo}>{index + 1}</Text>
      <Text style={styles.item}>{item.product_code ? item.product_code : '--'}</Text>
      <Text style={styles.description}>
        <Text style={styles.productName}>{item.name}</Text>:{item.sale_desc}
      </Text>
      {/* <Text style={styles.description}>{item.sale_desc}</Text> */}
      <Text style={styles.qty}>{item.sale_qty}</Text>
      <Text style={styles.unitPrice}>{item.sale_unit_price}</Text>
      <Text style={styles.account}>{item.saleDiscountPercent}</Text>
      <Text style={styles.rate}>{item.sale_tax_rate ? item.sale_tax_rate : '--'}</Text>
      <Text style={styles.amount}>{item.sale_amount ? item.sale_amount.toFixed(2) : '-'}</Text>
    </View>
  ))
  return <Fragment>{rows}</Fragment>
}

export default InvoiceTableRow
