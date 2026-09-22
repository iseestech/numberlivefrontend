import React, { Fragment } from 'react'
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import logo from '/assets/logo.svg'

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
  },
  col: {
    flexDirection: 'col',
  },

  reportTitle: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
  },
  advisorTitle: {
    fontFamily: 'Helvetica-Bold',
    color: '#000',
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  org: {
    marginTop: 5,
    opacity: 0,
  },
  logo: {
    width: 24,
    height: 24,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  faded: {
    color: 'grey',
    fontSize: '10',
  },
})

const InvoiceTitle = ({
  title,
  invoice,
  orgName,
  orgCode,
  date,
  city,
  street,
  zipCode,
  invoiceNo,
  expDate,
  estDate,
}) => (
  <Fragment>
    <View style={styles.headerContainer}>
      <View style={styles.col}>
        <Text style={styles.advisorTitle}>{orgName}</Text>
        <Text>{orgCode}</Text>
        <Text style={styles.faded}>
          {city},{street}
        </Text>
        <Text style={styles.faded}>{zipCode}</Text>
      </View>
      <View style={styles.col}>
        <Text style={styles.advisorTitle}>{title}</Text>
        {/* <Text>{date}</Text> */}
        <Text>
          Invoice Date: <Text style={styles.bold}>{estDate}</Text>
        </Text>
        <Text>
          Paymnet Due Date: <Text style={styles.bold}>{expDate}</Text>
        </Text>
        <Text>
          Invoice No: <Text style={styles.bold}>{invoiceNo}</Text>
        </Text>
      </View>
    </View>
  </Fragment>
)

export default InvoiceTitle
