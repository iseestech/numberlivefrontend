import React, { Fragment } from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 14,
  },
  innerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // marginTop: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderColor: 'lightgrey',
    marginTop: 2,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
  },
  col: {
    flexDirection: 'col',
    width: '40%',
    // backgroundColor: 'red',
    // padding: 15,
    // border: 1,
    // borderStyle: 'dashed',
  },
  hidden: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0,
  },
  total: {
    color: '#000',
    marginTop: 2,
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    // textAlign: 'center',
    textAlign: 'center',
    width: 100,
  },
  subtotal: {
    color: '#000',
    marginTop: 2,
    fontSize: 11,
    // textAlign: 'right',
    // textTransform: 'uppercase',
  },
  subtotalVal: {
    color: '#000',
    marginTop: 2,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
    width: 80,
  },
  logo: {
    width: 24,
    height: 24,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})

const InvoiceTableFooter = ({ items, subTotal, taxType, discount, tax, totalAmount }) => {
  // const total = items
  //   .map(item => item.qty * item.rate)
  //   .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

  return (
    <Fragment>
      <View style={styles.row}>
        <Text style={styles.hidden}>Purchase Order - true</Text>
        <View style={styles.col}>
          {/* <Text style={styles.subtotal}>Advisor</Text> */}

          <View style={styles.totalRow}>
            <Text style={styles.total}>Total: </Text>
            <Text style={styles.total}>&nbsp;{totalAmount} /-</Text>
          </View>
        </View>
      </View>
      {/* </View> */}
    </Fragment>
  )
}

export default InvoiceTableFooter
