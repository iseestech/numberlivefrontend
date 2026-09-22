import React, { Fragment } from 'react'
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import logo from '/assets/logo.svg'

const styles = StyleSheet.create({
  headerReportContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    // marginTop: 10,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderTopColor: 'lightgrey',
    borderBottomColor: 'lightgrey',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
  },
  col: {
    flexDirection: 'col',
  },
  colFull: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
  },
  heading: {
    fontSize: 14,
  },
  reportTitle: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
  },
  advisorTitle: {
    fontFamily: 'Helvetica-Bold',
    color: '#000',
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  org: {
    marginTop: 5,
    opacity: 0,
  },
  date: {
    fontSize: 13,
    textAlign: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  dateCss: {
    fontWeight: '700',
    fontFamily: 'Helvetica-Bold',
  },
})

const InvoiceTitleReports = ({ title, flag, dateValue, info }) => {
  // console.log('dateValue', title, info)
  return (
    <Fragment>
      <View style={styles.headerReportContainer}>
        <View style={styles.colFull}>
          <Text style={styles.title}>{info.name || ''}</Text>
          <Text style={styles.date}>
            {/* {dateValue || ""} */}
            {dateValue ? (
              <Text>
                From <Text style={styles.dateCss}>{dateValue[0]}</Text> To{' '}
                <Text style={styles.dateCss}>{dateValue[1]} </Text>
              </Text>
            ) : (
              ''
            )}
          </Text>
        </View>
      </View>
    </Fragment>
  )
}

export default InvoiceTitleReports
