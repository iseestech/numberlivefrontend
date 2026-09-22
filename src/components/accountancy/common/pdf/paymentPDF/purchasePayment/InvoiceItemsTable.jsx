import React from 'react'
import { View, StyleSheet } from '@react-pdf/renderer'
import InvoiceTableHeader from './InvoiceTableHeader'
import InvoiceTableRow from './InvoiceTableRow'
import InvoiceTableBlankSpace from './InvoiceTableBlankSpace'
import InvoiceTableFooter from './InvoiceTableFooter'

const tableRowsCount = 11

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    borderWidth: 0,
    borderColor: '#bff0fd',
  },
})

const InvoiceItemsTable = ({ invoice, salesValue, tableData }) => (
  <View style={styles.tableContainer}>
    <InvoiceTableHeader salesValue={salesValue} />
    <InvoiceTableRow items={tableData || []} salesValue={salesValue} />
    {/* <InvoiceTableBlankSpace rowsCount={tableRowsCount - invoice.items.length} /> */}
    <InvoiceTableBlankSpace rowsCount={2} />
  </View>
)

export default InvoiceItemsTable
