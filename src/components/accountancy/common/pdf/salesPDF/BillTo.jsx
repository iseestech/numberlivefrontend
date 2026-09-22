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

const BillTo = ({
  invoice,
  clientFirstName,
  clientLastName,
  orderNumber,
  expDate,
  estDate,
  email,
  title,
  salesValue,
  invoiceNo,
  companyName,
  customerPhone,
  quoteData,
}) => (
  <View style={styles.headerContainer}>
    <View style={styles.col}>
      <Text style={styles.bold}>Bill To</Text>
      <Text>
        Company Name: <Text style={styles.bold}>{companyName}</Text>
      </Text>
      <Text style={styles.billTo}>
        Customer Name:{' '}
        <Text style={styles.bold}>
          {clientFirstName} {clientLastName}
        </Text>
      </Text>
      <Text>
        Customer Email: <Text style={styles.bold}>{email}</Text>
      </Text>
      <Text>
        Contact No: <Text style={styles.bold}>{customerPhone}</Text>
      </Text>
      <Text>
        Customer Address:{' '}
        <Text style={styles.bold}>
          {quoteData.address} {quoteData.city} {quoteData.state} {quoteData.country}{' '}
          {quoteData.zipcode}
        </Text>
      </Text>
      {/* <Text>
        Estimation Date: <Text style={styles.bold}>{estDate}</Text>
      </Text>
      <Text>
        Expiry Date: <Text style={styles.bold}>{expDate}</Text>
      </Text>
      <Text>
        Invoice Number: <Text style={styles.bold}>{invoiceNo}</Text>
      </Text> */}
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
