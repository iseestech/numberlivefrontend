import React from 'react'
import { Page, Document, Image, StyleSheet } from '@react-pdf/renderer'
// import logo from '/assets/logo.png'
import _ from 'lodash'
import InvoiceTitle from './InvoiceTitle'

import InvoiceItemsTable from './InvoiceItemsTable'
import InvoiceDetailsInfo from './InvoiceDetailsInfo'
import InvoiceTableFooter from './InvoiceTableFooter'
import InvoiceTitleReports from './InvoiceTitleReports'

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
  flag,
  dateValue,
  detailsInfo,
  masterData,
}) => {
  let totalVal = 0
  // console.log(masterData, 'masterData')
  if (salesValue === 'Purchase Order Report') {
    // console.log('quoteData', quoteData)
    totalVal = quoteData.reduce((partialSum, { amount }) => partialSum + amount, 0)
  } else if (flag === 'PurchaseReturnDetails') {
    totalVal = quoteData.reduce(
      (partialSum, { purchaseReturnAmount }) => partialSum + purchaseReturnAmount,
      0,
    )
  } else if (flag === 'PurchaseOrderDetails') {
    const res = quoteData.map(({ purchase_amount: purchaseAmount, ...rest }) => ({
      purchaseAmount,
      ...rest,
    }))

    totalVal = res.reduce((partialSum, { purchaseAmount }) => partialSum + purchaseAmount, 0)
  } else if (flag === 'PurchasePaymentDetails') {
    totalVal = masterData?.total
  } else if (flag === 'SalesPaymentDetails') {
    totalVal = masterData?.total
  } else {
    totalVal = quoteData.reduce((partialSum, { total }) => partialSum + total, 0)
  }

  const custName =
    quoteData.length && quoteData[0].customername && quoteData[0].customername.length > 0
      ? quoteData[0].customername
      : ''
  // console.log('custName', custName, salesValue)
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {flag === 'SalesByCustomer' ||
        flag === 'SalesByCustomerDetails' ||
        (flag === 'PurchaseOrderListReport' && dateValue !== '') ||
        (flag === 'PurchaseInvoiceListReport' && dateValue !== '') ||
        (flag === 'SalesQuoteList' && dateValue !== '') ||
        (flag === 'SalesOrderList' && dateValue !== '') ||
        (flag === 'SalesInvoiceReportList' && dateValue !== '') ||
        flag === 'SalesByItems' ||
        flag === 'CutomerDetails' ||
        flag === 'DatewiseInventory' ||
        flag === 'RecievableSummary' ||
        flag === 'VendorBalance' ||
        flag === 'CustomerBalance' ? (
          <InvoiceTitleReports
            title={salesValue}
            invoice={invoice}
            flag={flag}
            dateValue={dateValue}
            customerName={custName}
            // orgName={orgName}
            // orgCode={orgCode}
          />
        ) : (
          <InvoiceTitle
            title={salesValue}
            invoice={invoice}
            flag={flag}
            orgName={orgName}
            orgCode={orgCode}
          />
        )}
        {!_.isEmpty(detailsInfo) && <InvoiceDetailsInfo detailsInfo={detailsInfo} />}
        {/* {(detailsInfo !== undefined && Object.entries(detailsInfo).length) && (
          <InvoiceDetailsInfo detailsInfo={detailsInfo} />
        )} */}
        <InvoiceItemsTable salesValue={salesValue} tableData={quoteData} flag={flag} />
        <InvoiceTableFooter masterData={masterData} totalAmount={totalVal} flag={flag} />
      </Page>
    </Document>
  )
}

export default Invoice
