import React, { Fragment } from 'react'
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import logo from '/assets/logo.png'

const styles = StyleSheet.create({
  headerReportContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    // marginTop: 10,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderTopColor: 'lightgrey',
    borderBottomColor: 'lightgrey',
  },
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
  colFull: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
  },
  heading: {
    fontSize: 14,
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
})

const InvoiceTitle = ({ title, invoice, flag, orgName, orgCode }) => {
  const fl =
    flag &&
    (flag === 'PurchaseOrderListReport' ||
      flag === 'SalesQuoteList' ||
      flag === 'SalesOrderList' ||
      flag === 'SalesInvoiceReportList' ||
      flag === 'SalesByItems' ||
      flag === 'PurchaseInvoiceListReport')
  return fl === true ? (
    <>
      <View style={styles.headerReportContainer}>
        <View style={styles.colFull}>
          <Text style={styles.heading}>{orgName}</Text>
          <Text style={styles.title}>{title}</Text>
          {/* <Text style={styles.date}>{dateValue}</Text> */}
        </View>
      </View>
    </>
  ) : (
    <Fragment>
      <View style={styles.headerContainer}>
        {/* <Image style={styles.logo} src={logo} />
      <Text style={styles.advisorTitle}>Advisor</Text> */}
        {/* <Text style={styles.reportTitle}>Purchase Order - true</Text> */}
        <View style={styles.col}>
          {/* <Text style={styles.advisorTitle}>Advisor</Text> */}
          <Text style={styles.advisorTitle}>{title}</Text>

          {/* <Image style={styles.logo} src={logo} /> */}
        </View>
        <View style={styles.col}>
          <Image style={styles.logo} src={logo} />
          {/* 
        <Text style={styles.org}>{orgName}</Text>
        <Text>{orgName}</Text> */}
        </View>
      </View>
      <View style={styles.titleContainer}>
        <View style={styles.col}>
          <Text>Organization - {orgName}</Text>
        </View>
        <View style={styles.col}>
          {/* <Image style={styles.logo} src={logo} /> */}
          {/* <Text style={styles.org}>{orgName}</Text> */}
          <Text>{orgCode}</Text>
        </View>
      </View>
    </Fragment>
  )
}

export default InvoiceTitle
