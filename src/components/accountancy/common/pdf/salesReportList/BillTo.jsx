import React from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'
import HelperFunction from '@/services/helper'

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderTopColor: 'lightgrey',
    borderBottomColor: 'lightgrey',
  },
  hidden: {
    marginTop: 10,
    opacity: 0,
  },
  clientName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: '16px',
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  col: {
    flexDirection: 'column',
    // width: '50%',
  },
  billTo: {
    marginTop: 10,
    // paddingBottom: 3,
  },
})

const BillTo = ({ invoice, clientFirstName, clientLastName, orderNumber, date, salesValue }) => (
  <View style={styles.headerContainer}>
    <View style={styles.col}>
      <View style={styles.col}>
        <Text style={styles.billTo}>
          {clientFirstName} {clientLastName}
        </Text>
      </View>
      <Text style={styles.billTo}>
        {salesValue} Date:<Text style={styles.bold}> {HelperFunction.dateFormatted(date)}</Text>
      </Text>
      <Text>
        {salesValue} No:<Text style={styles.bold}> {orderNumber}</Text>
      </Text>
      {/* <Text>Order Number:</Text> */}
    </View>
    <View style={styles.col}>
      {/* <Text style={styles.billTo}>
        {clientFirstName} {clientLastName}
      </Text> */}
      {/* <Text>123 Main Street</Text>
      <Text> San Francisco CA, 94103</Text>
      <Text>hello@useanvil.com</Text> */}
    </View>

    {/* <View style={styles.col}>
      <Text style={styles.hidden}> a</Text>
      <Text>Issued:</Text>
      <Text>Order Number:</Text>
    </View>
    <View style={styles.col}>
      <Text style={styles.billTo}>From:</Text>
      <Text>20/09/2021</Text>
      <Text style={styles.hidden}> Order Number:</Text>
    </View>
    <View style={styles.col}>
      <Text style={styles.billTo}>Isees</Text>
      <Text style={styles.hidden}> 20/9/2021</Text>
      <Text style={styles.hidden}> 1110</Text>
    </View> */}
  </View>
)

export default BillTo
