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
    justifyContent: 'space-between',
  },
  itemContent: {
    width: '25%',
    marginTop: 10,
  },
})

const BillTo = () => (
  <View style={styles.headerContainer}>
    {/* First Row */}
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <Text> Vendor Name </Text>
        <Text> XYZ12</Text>
      </View>
      <View style={styles.itemContent}>
        <Text> Payment Date </Text>
        <Text> XYZ23</Text>
      </View>
      <View style={styles.itemContent}>
        <Text> Amount Paid </Text>
        <Text> XYZ45</Text>
      </View>
      <View style={styles.itemContent}>
        <Text> Payment # </Text>
        <Text> XYZ67</Text>
      </View>
    </View>

    {/* second row */}
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <Text> Debit from</Text>
        <Text> XYZ12</Text>
      </View>
      <View style={styles.itemContent}>
        <Text> Payment Mode </Text>
        <Text> XYZ23</Text>
      </View>
      <View style={styles.itemContent}>
        <Text> Refference </Text>
        <Text> XYZ45</Text>
      </View>
      <View style={styles.itemContent}>
        <Text> Tax Deducted </Text>
        <Text> XYZ67</Text>
      </View>
    </View>
  </View>
)

export default BillTo
