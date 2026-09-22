import React from 'react'
import { Page, Document, Image, StyleSheet, Text } from '@react-pdf/renderer'
// import logo from '/assets/logo.png'

import InvoiceTitle from '../InvoiceTitle'
import BillTo from '../BillTo'
import InvoiceNo from '../InvoiceNo'
import InvoiceItemsTable from '../InvoiceItemsTable'
import InvoiceThankYouMsg from '../InvoiceThankYouMsg'
import InvoiceTableFooter from '../InvoiceTableFooter'
import ReportHeader from './ReportHeader'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    lineHeight: 1.5,
    flexDirection: 'column',
  },
  logo: {
    width: 74,
    height: 66,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})

const SalesReport = ({ invoice, orgName, orgCode, quoteData, salesValue, dateValue }) => {
  let totalVal = 0
  if (salesValue.includes('Quote')) {
    totalVal = quoteData.reduce((partialSum, { total }) => partialSum + total, 0)
  } else if (salesValue.includes('Order')) {
    totalVal = quoteData.reduce((partialSum, { amount }) => partialSum + amount, 0)
  } else if (salesValue.includes('Invoice')) {
    totalVal = quoteData.reduce((partialSum, { total }) => partialSum + total, 0)
  } else {
    //
  }
  // console.log(totalVal)
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <ReportHeader
          salesValue={salesValue}
          invoice={invoice}
          orgName={orgName}
          orgCode={orgCode}
        />
        {/* <BillTo
        invoice={invoice}
        clientFirstName={quoteData.firstName}
        clientLastName={quoteData.lastName}
        orderNumber={
          salesValue.includes('Invoice') ? quoteData.invoiceNo : quoteData.purchase_order_no
        }
        date={quoteData.expiryDate}
        salesValue={salesValue}
      /> */}
        <InvoiceItemsTable invoice={invoice} salesValue={salesValue} tableData={quoteData} />
        <InvoiceTableFooter totalAmount={totalVal} />
      </Page>
    </Document>
  )
}

export default SalesReport
