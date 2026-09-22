import React from 'react'
import { Page, Document, Image, StyleSheet } from '@react-pdf/renderer'
import logo from '/assets/logo.png'

import InvoiceTitle from './InvoiceTitle'
import BillTo from './BillTo'
import InvoiceNo from './InvoiceNo'
import InvoiceItemsTable from './InvoiceItemsTable'
import InvoiceThankYouMsg from './InvoiceThankYouMsg'
import InvoiceTableFooter from './InvoiceTableFooter'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
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

const OrderList = ({ invoice, orgName, orgCode, quoteData, salesValue }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <InvoiceTitle
        title="Purchase Order List"
        // invoice={invoice}
        orgName="Abc"
        orgCode="ORG--2334"
      />
      <InvoiceItemsTable invoice={invoice} />
      {/* <InvoiceTableFooter
        items={invoice.items}
        discount={quoteData.totalPurchaseDiscountAmount}
        taxType={quoteData.taxType}
        subTotal={quoteData.sub_total}
        totalAmount={quoteData.total}
      /> */}
    </Page>
  </Document>
)

export default OrderList
