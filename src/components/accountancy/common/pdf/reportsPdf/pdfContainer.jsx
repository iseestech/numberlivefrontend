import React from 'react'
import { Page, Document, Image, StyleSheet, View, Text } from '@react-pdf/renderer'
import logo from '/assets/logo.png'
import _ from 'lodash'
import InvoiceTitle from './InvoiceTitle'
// import BillTo from './BillTo'
// import InvoiceNo from './InvoiceNo'
import InvoiceItemsTable from './InvoiceItemsTable'
import InvoiceDetailsInfo from './InvoiceDetailsInfo'
// import InvoiceThankYouMsg from './InvoiceThankYouMsg'
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
  info,
}) => {
  let totalVal = 0
  console.log(flag, 'masterData', quoteData)
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
  } else if (flag !== 'profitAndLoss') {
    totalVal = quoteData.reduce((partialSum, { total }) => partialSum + total, 0)
  }
  // console.log(totalVal, quoteData, 'flagflagflagflag')
  const column = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Account',
      dataIndex: 'accountName',
      name: 'accountName',
      responsive: ['xs', 'sm'],
    },
    {
      title: 'Description',
      dataIndex: 'description',
      name: 'description',
      responsive: ['xs', 'sm'],
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      name: 'debit',
      responsive: ['xs', 'sm'],
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      responsive: ['xs', 'sm'],
      name: 'credit',
    },
  ]
  const getHeader = column.map(x => x.dataIndex)
  const custName =
    quoteData &&
    quoteData.length &&
    quoteData[0].customername &&
    quoteData[0].customername.length > 0
      ? quoteData[0].customername
      : ''
  // console.log(quoteData, 'custName', custName, salesValue)
  const rowsData = [{ name: 'test' }].map((item, index) => (
    <View style={styles.row} key={item.id}>
      <Text>{item.name}</Text>
    </View>
  ))
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {flag === 'SalesByCustomer' ? (
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
        {!_.isEmpty(dateValue) && (
          <InvoiceTitleReports
            title={salesValue}
            invoice={invoice}
            flag={flag}
            dateValue={dateValue}
            customerName={custName}
            info={info}
          />
        )}
        {!_.isEmpty(detailsInfo) && <InvoiceDetailsInfo detailsInfo={detailsInfo} />}
        <InvoiceItemsTable salesValue={salesValue} tableData={quoteData || []} flag={flag} />
        <InvoiceTableFooter tableData={quoteData || []} flag={flag} />
        {/* {rowsData} */}
      </Page>
    </Document>
  )
}

export default Invoice
