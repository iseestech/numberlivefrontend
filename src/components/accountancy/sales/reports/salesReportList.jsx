import React, { useState, useEffect } from 'react'
import { Button, Table, Tabs, DatePicker } from 'antd'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import QuotationService from '@/services/sales'
import queryString from 'query-string'
import tableData from './data.json'

const { TabPane } = Tabs

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const SalesReportList = () => {
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [page, setpage] = useState(1)

  const config = {
    __report: 'DateWise_Sales.rptdesign',
    copyrightInfo: '2021',
    isDMP: 'N',
    isIntCirculation: 'N',
    OrgId: '1',
    FindDate: '03/01/21',
  }

  const qs = queryString.stringify(config)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await QuotationService.invoiceList()
  //   }
  //   fetchData()
  // }, [page])

  // http://103.8.167.194:8082/birt/frameset?
  // __report=personwise.rptdesign
  // &copyrightInfo=2021&
  // isDMP=Y&isIntCirculation=Y&
  // OrgId=1&
  // rpttitle=persion%20wise%20sale
  // &FindDate=03/01/21&CustName=Aniket
  const onChange = (date, dateString) => {
    // console.log(date, dateString)
  }

  // console.log(routerData, 'router')
  const queryVal = routerData.history.location.search
  const routeName = routerData.match.path.split('/')[2]
  const { accepted, sent, draft, invoiced, declined } = quotationList
  return (
    <div>
      <div className="row">
        <div className="col-sm-4">
          Start Date : <DatePicker onChange={onChange} />
        </div>
        <div className="col-sm-4">
          End Date : <DatePicker onChange={onChange} />
        </div>
      </div>
      {/* <Table rowKey="id" columns={tableColumns} dataSource={quotations} pagination={false} /> */}
      {queryVal.indexOf('datewise') > -1 && (
        <iframe
          style={{ height: '80vh', width: '100%' }}
          src="http://103.8.167.194:8082/birt/frameset?__report=DateWise_Sales.rptdesign"
          title="Date wise Report"
        />
      )}
      {queryVal.indexOf('monthwise') > -1 && (
        <iframe
          style={{ height: '80vh', width: '100%' }}
          src="http://103.8.167.194:8082/birt/frameset?__report=MonthWise_Sales.rptdesign"
          title="Date wise Report"
        />
      )}
      {queryVal.indexOf('customer') > -1 && (
        <iframe
          style={{ height: '80vh', width: '100%' }}
          src="http://103.8.167.194:8082/birt/frameset?__report=personwise.rptdesign"
          title="Date wise Report"
        />
      )}
    </div>
  )
}

export default connect()(SalesReportList)
