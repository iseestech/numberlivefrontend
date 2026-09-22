import React from 'react'
import { Text, View, StyleSheet, Note } from '@react-pdf/renderer'
import HelperFunction from '@/services/helper'

const styles = StyleSheet.create({
  headerContainer: {
    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderTopColor: 'lightgrey',
    borderBottomColor: 'lightgrey',
  },
  hidden: {
    marginTop: 10,
    opacity: 0,
  },
  clientName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: '16px',
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  col: {
    flexDirection: 'column',
    // width: '50%',
  },
  billTo: {
    marginTop: 10,
    // paddingBottom: 3,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemContent: {
    width: '33%',
    marginTop: 10,
  },
})

const drawInfo = data => {
  const arr = Object.keys(data).map(key => (
    <View key={key} style={styles.itemContent}>
      <Text> {key} </Text>
      <Text> {data[key]}</Text>
    </View>
  ))

  return arr
}

const InvoiceDetailsInfo = ({ detailsInfo }) => {
  return (
    <View style={styles.headerContainer}>
      {/* First Row */}
      <View style={styles.item}>{drawInfo(detailsInfo)}</View>
    </View>
  )
}

export default InvoiceDetailsInfo
