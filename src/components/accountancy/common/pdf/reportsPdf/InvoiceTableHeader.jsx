import React from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'
import TableHeaderJSON from './pfdTableHeader.json'

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

  colWid: {
    width: '20%',
  },
  srNo: {
    width: '5%',
    // textAlign: 'left',
    // borderRightColor: borderColor,
    // borderRightWidth: 0,
    paddingLeft: 3,
  },
})

const InvoiceTableHeader = ({ salesValue, flag }) => {
  // console.log(TableHeaderJSON.flag, 'TableHeaderJSON ProductList', flag)
  // const headerKey = salesValue.includes("Invoice") ? "salesValue === 'Purchase Order' ? (
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.srNo}>#</Text>
        {TableHeaderJSON[flag] !== undefined &&
          TableHeaderJSON[flag].map((item, index) => {
            return (
              <Text style={item.css !== undefined ? item.css : styles.colWid} key={item.name}>
                {item.name}
              </Text>
            )
          })}
      </View>
    </>
  )
  // ) : return
}

export default InvoiceTableHeader
