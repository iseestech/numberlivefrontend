import React, { Fragment } from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'
import TableHeaderJSON from './pfdTableHeader.json'

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: 'lightgrey',
    backgroundColor: '#EEF2F5',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 40,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    // flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 14,
  },
  innerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // marginTop: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderColor: 'lightgrey',
    marginTop: 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  col: {
    flexDirection: 'col',
    width: '50%',
    // backgroundColor: 'red',
    padding: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  hidden: {
    color: '#000',
    fontSize: 12,
    textAlign: 'left',
    opacity: 0,
  },
  total: {
    color: '#000',
    marginTop: 2,
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
    width: 80,
  },
  subtotal: {
    color: '#000',
    marginTop: 2,
    fontSize: 11,
    // textAlign: 'right',
    // textTransform: 'uppercase',
  },
  subtotalVal: {
    color: '#000',
    marginTop: 2,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
    width: 80,
  },
  taxType: {
    color: '#000',
    marginTop: 2,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    width: 80,
  },
  logo: {
    width: 24,
    height: 24,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  rowCss: {
    width: '25%',
  },
  totalText: {
    paddingLeft: 10,
  },
})

const InvoiceTableFooter = ({ footerRowData, flag, tableData }) => {
  // console.log(footerRowData, 'footerData', flag)
  // const rowsData = footerRowData.map((item, index) => {
  //   // console.log(item.name, '45555')
  //   const fieldText = item.name ? <Text style={styles.rowCss}>{item.name}</Text> : <Text style={styles.rowCss}>&nbsp;</Text>
  //   return (
  //     <View style={styles.row} key={item.id}>
  //       {fieldText}
  //     </View>
  //   )
  // })
  const rowsData = TableHeaderJSON[flag].map((item, index) => {
    // console.log(item.name, '45555')
    let fieldText = ''
    if (item.total) {
      const getTotal = tableData.reduce((sum, record) => sum + record[item.value] || 0, 0)
      fieldText = (
        <Text style={{ ...item.css, alignItems: 'center' } || styles.rowCss}>{getTotal || 0}</Text>
      )
    } else {
      fieldText = <Text style={styles.rowCss}>&nbsp;</Text>
    }
    return (
      <View style={{ ...item.css, alignItems: 'center' } || styles.row} key={item.name}>
        {fieldText}
      </View>
    )
  })

  // const rowData = <Text>test</Text>
  return (
    <Fragment>
      <View style={styles.container}>
        {/* <Text style={item.css !== undefined ? item.css : styles.colWid} key={item.name}>
                {item.name}
              </Text> */}
        <Text style={styles.totalText}>Total</Text>
        {rowsData}
      </View>
    </Fragment>
  )
}

export default InvoiceTableFooter
