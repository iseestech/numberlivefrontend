import React from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'
import HelperFunction from '@/services/helper'

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    // marginTop: 10,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderTopColor: 'lightgrey',
    borderBottomColor: 'lightgrey',
  },
  hidden: {
    // marginTop: 10,
    opacity: 0,
  },
  clientName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: '16px',
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  col: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
  },
})

const ReportHeader = ({
  invoice,
  clientFirstName,
  clientLastName,
  orderNumber,
  date,
  salesValue,
  orgName,
  orgCode,
  dateValue,
}) => (
  <View style={styles.headerContainer}>
    <View style={styles.col}>
      <Text style={styles.heading}>{orgName}</Text>
      <Text style={styles.title}>{salesValue}</Text>
      <Text style={styles.date}>{dateValue}</Text>
    </View>
    {/* <View>
        <Text style={styles.title}>{salesValue}</Text>
      </View> */}
    {/* <View style={styles.col}>
        <Image style={styles.logo} src={logo} />
        <Text style={styles.org}>{orgName}</Text>
        <Text>{orgCode}</Text>
      </View> */}
    {/* </View> */}
  </View>
)

export default ReportHeader
