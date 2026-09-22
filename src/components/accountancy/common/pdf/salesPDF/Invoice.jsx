import React from 'react'
import { Page, Document, Image, StyleSheet } from '@react-pdf/renderer'
// import logo from '/assets/logo.png'

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

const Invoice = ({
  invoice,
  orgName,
  orgCode,
  quoteData,
  salesValue,
  city,
  street,
  zipCode,
  invoiceNo,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle
          title={salesValue}
          invoice={invoice}
          orgName={orgName}
          orgCode={orgCode}
          date={quoteData.estimateDate}
          city={city}
          street={street}
          zipCode={zipCode}
          invoiceNo={quoteData.invoiceNo}
          expDate={quoteData.expiryDate}
          estDate={quoteData.estimateDate}
        />
        <BillTo
          invoice={invoice}
          clientFirstName={quoteData.firstName}
          clientLastName={quoteData.lastName}
          orderNumber={
            salesValue.includes('Invoice') ? quoteData.invoiceNo : quoteData.purchase_order_no
          }
          expDate={quoteData.expiryDate}
          estDate={quoteData.estimateDate}
          email={quoteData.email}
          title={salesValue}
          salesValue={salesValue}
          invoiceNo={quoteData.invoiceNo}
          companyName={quoteData.customerName}
          customerPhone={quoteData.phone_number}
          quoteData={quoteData}
        />
        <InvoiceItemsTable
          invoice={invoice}
          salesValue={salesValue}
          tableData={quoteData.productDto || []}
        />
        <InvoiceTableFooter
          items={invoice.items}
          discount={quoteData.totalSaleDiscountAmount}
          taxType={quoteData.taxType}
          tax={quoteData.totalSaleTaxAmount}
          subTotal={quoteData.sub_total}
          totalAmount={quoteData.total}
        />
      </Page>
    </Document>
  )
}

export default Invoice
