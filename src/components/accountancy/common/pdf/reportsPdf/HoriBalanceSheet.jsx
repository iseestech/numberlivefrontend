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
  tableSection: {
    width: '100%',
    border: '1px solid #ccc',
  },
  headerSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  contentSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  leftConSection: {
    width: '50%',
    padding: 10,
    borderRight: '1px solid #ccc',
  },
  rightConSection: {
    width: '50%',
    padding: 10,
  },
  leftSection: {
    width: '50%',
    padding: 10,
    borderRight: '1px solid #ccc',
    backgroundColor: '#f2f4f8',
    textAlign: 'center',
  },
  rightSection: {
    width: '50%',
    padding: 10,
    backgroundColor: '#f2f4f8',
    textAlign: 'center',
  },
  pl3: {
    width: '100%',
  },
  subAccountRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  accountName: {
    width: '50%',
  },
  accountBal: {
    width: '50%',
    textAlign: 'right',
  },
  accountHeading: {
    fontFamily: 'Helvetica-Bold',
    color: '#000',
    fontSize: 12,
  },
  subTotal: {
    fontFamily: 'Helvetica-Bold',
    color: '#000',
    fontSize: 12,
  },
  footerAccountBal: {
    fontFamily: 'Helvetica-Bold',
    color: '#000',
    fontSize: 12,
    textAlign: 'right',
  },
  totalFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  totalFooterText: {
    width: '50%',
    // textAlign: 'right',
  },
  totalFooterBal: {
    width: '50%',
    textAlign: 'right',
  },
  footerSection: {
    borderTop: '1px solid #ccc',
    marginTop: 5,
    paddingTop: 15,
  },
})

const HoriBalanceSheetPdf = ({
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
  //   let totalVal = 0
  // console.log(quoteData, 'masterData')

  // console.log(quoteData, 'flagflagflagflag')

  //   const getHeader = column.map(x => x.dataIndex)

  // console.log(quoteData, 'custName', salesValue)

  const renderLiabilities = (accounts, type) => {
    console.log('accounts', accounts)
    const { total } = quoteData
    let diffVal = 0
    let totalVal =
      total.assets?.totalbalance > total.liabilities?.totalbalance
        ? total.assets?.totalbalance.toFixed(2)
        : total.liabilities?.totalbalance.toFixed(2)

    if (type === 'liabilities' && total[type]?.totalbalance < total.assets?.totalbalance) {
      diffVal = total.assets?.totalbalance.toFixed(2) - total[type]?.totalbalance.toFixed(2) || 0
      totalVal = total.assets?.totalbalance.toFixed(2)
    } else if (type === 'assets' && total[type]?.totalbalance < total.liabilities?.totalbalance) {
      diffVal =
        total.liabilities?.totalbalance.toFixed(2) - total[type]?.totalbalance.toFixed(2) || 0
      totalVal = total.liabilities?.totalbalance.toFixed(2)
    }
    return (
      <>
        {Object.keys(accounts).map(item => {
          return (
            <View style={styles.accountRow}>
              {Object.keys(accounts?.[item]).map(elem => {
                return (
                  <View>
                    <Text span={24} style={styles.accountHeading}>
                      <Text>{elem}</Text>
                    </Text>
                    {Object.keys(accounts?.[item]?.[elem]).map(eleVal => {
                      return (
                        <View>
                          <Text span={24} style={styles.accountHeading}>
                            <Text>{eleVal}</Text>
                          </Text>
                          {accounts?.[item]?.[elem]?.[eleVal].length &&
                            accounts?.[item]?.[elem]?.[eleVal].map(ele => {
                              return (
                                <View span={24} style={styles.pl3}>
                                  <View style={styles.subAccountRow}>
                                    <Text span={12}>{ele.accountName}</Text>
                                    <Text span={12} style={styles.accountBal}>
                                      {ele.Balance}
                                    </Text>
                                  </View>
                                </View>
                              )
                            })}
                        </View>
                      )
                    })}
                  </View>
                )
              })}
            </View>
          )
        })}
        <Text style={styles.mt5}>&nbsp;</Text>
        <View>
          <View style={styles.subAccountRow}>
            <Text span={12}>
              <Text style={styles.subTotal}>Subtotal</Text>
            </Text>
            <Text span={12} style={styles.accountBal}>
              <Text>{total[type]?.totalbalance.toFixed(2)}</Text>
            </Text>
          </View>
          {type === 'assets' && total[type]?.totalbalance < total.liabilities?.totalbalance && (
            <View style={styles.subAccountRow}>
              <Text span={12}>
                <Text>Difference in opening balance</Text>
              </Text>
              <Text span={12} style={styles.accountBal}>
                <Text> + {diffVal.toFixed(2)}</Text>
              </Text>
            </View>
          )}
          {type === 'liabilities' && total[type]?.totalbalance < total.assets?.totalbalance && (
            <View style={styles.subAccountRow}>
              <Text span={12}>
                <Text>Difference in opening balance</Text>
              </Text>
              <Text span={12} style={styles.accountBal}>
                <Text> + {diffVal.toFixed(2)}</Text>
              </Text>
            </View>
          )}
        </View>
        <View span={24} style={styles.footerSection}>
          <View>
            <View span={24} style={styles.subAccountRow}>
              <Text style={styles.subTotal}>Total</Text>
              <Text style={styles.footerAccountBal}>{totalVal}</Text>
            </View>
          </View>
        </View>
      </>
    )
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle
          title={salesValue}
          invoice={invoice}
          flag={flag}
          orgName={orgName}
          orgCode={orgCode}
          dateValue={dateValue}
        />

        <View style={styles.tableSection}>
          <View style={styles.headerSection}>
            <View style={styles.rightSection}>
              <Text>Income</Text>
            </View>
            <View style={styles.leftSection}>
              <Text>Expenses</Text>
            </View>
          </View>
          <View style={styles.contentSection}>
            <View style={styles.leftConSection}>
              {renderLiabilities(quoteData.assets, 'assets')}
            </View>
            <View style={styles.rightConSection}>
              {renderLiabilities(quoteData.liabilities, 'liabilities')}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default HoriBalanceSheetPdf
