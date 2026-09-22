import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Select,
  Divider,
  Modal,
  DatePicker,
  Row,
  Col,
} from 'antd'
import ReportServices from '@/services/reports'
import HelperFunction from '@/services/helper'
import moment from 'moment'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import { AgGridReact } from 'ag-grid-react'
import Receivable from '@/components/accountancy/JSON/Receivable'

const custDetails = [
  ...Receivable.customerBalanceDet,
  // {
  //   title: '#',
  //   dataIndex: 'key',
  //   key: 'key',
  //   // render: (text, record, index) => index + 1,
  // },
  // {
  //   title: 'Date',
  //   name: 'estimate_date',
  //   dataIndex: 'estimate_date',
  //   responsive: ['xs', 'sm'],
  //   render: (text, record) => {
  //     return HelperFunction.dateFormatted(record.estimate_date)
  //   },
  // },
  // {
  //   title: 'Invoice No',
  //   name: 'invoice_no',
  //   dataIndex: 'invoice_no',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Invoice Due Amt',
  //   dataIndex: 'invoice_due_amount',
  //   name: 'invoice_due_amount',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Total Amt without Tax',
  //   dataIndex: 'total_amt_without_tax',
  //   name: 'total_amt_without_tax',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Payment Status',
  //   name: 'payment_status',
  //   dataIndex: 'payment_status',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Status',
  //   dataIndex: 'status',
  //   name: 'status',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Total',
  //   dataIndex: 'total',
  //   name: 'total',
  //   responsive: ['xs', 'sm'],
  // },
]

const CustomerReportDetails = props => {
  const [tableCustData, setTableCustData] = useState([])
  const [tableItemData, setTableItemData] = useState([])
  const [tableCustInvoiceData, setTableCustInvoiceData] = useState([])
  const [gridApi, setGridApi] = useState()

  const { reportName, dateValue, reportId, handlePdfXlxCsv } = props

  const custBalColumn = [
    ...Receivable.customerBalance,
    // {
    //   title: '#',
    //   dataIndex: 'key',
    //   key: 'key',
    //   // render: (text, record, index) => index + 1,
    // },
    // {
    //   title: 'Customer Name',
    //   name: 'customername',
    //   dataIndex: 'customername',
    //   responsive: ['xs', 'sm'],
    //   render: (text, record, index) => (
    //     <Link className="hrefLink" to={`/report/Sales By Customer/${record.customer_id}`}>
    //       {' '}
    //       {record.customername}
    //     </Link>
    //   ),
    // },
    // {
    //   title: 'Received Amount',
    //   name: 'received_amt',
    //   dataIndex: 'received_amt',
    //   responsive: ['xs', 'sm'],
    // },
    // {
    //   title: 'Total Sale',
    //   name: 'total_sale',
    //   dataIndex: 'total_sale',
    //   responsive: ['xs', 'sm'],
    // },
    // {
    //   title: 'Balance',
    //   name: 'balance',
    //   dataIndex: 'balance',
    //   responsive: ['xs', 'sm'],
    // },
    // {
    //   title: 'Action',
    //   dataIndex: 'action',
    //   name: 'action',
    //   responsive: ['xs', 'sm'],
    //   render: (text, record, index) => (
    //     <Link to={`/report/${reportName} Details/${record.customer_id}`}> Click Here</Link>
    //   ),
    // },
  ]

  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format('MM/DD/YYYY'),
      endDate: moment(dateValue[1]).format('MM/DD/YYYY'),
      custId: reportId,
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.getCustomerBalanceDetails(obj)
      // console.log(result, 'Sales By getCustomerBalanceDetails')
      if (result && result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setTableCustInvoiceData(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: custDetails,
        fileName: reportName,
        salesValue: reportName,
        flag: 'cutomerBalDetails',
      })
    }
    if (Object.keys(org).length && !reportId && reportName === 'Customer Balance Details') {
      fetchData()
    }
  }, [dateValue])

  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      //   startDate: moment(dateValue[0]).format('MM/DD/YYYY'),
      //   endDate: moment(dateValue[1]).format('MM/DD/YYYY'),
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.getCustomerBalance(obj)
      // console.log(result, 'cust balance')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setTableCustData(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: custBalColumn,
        fileName: 'Customer Balance',
        salesValue: 'Customer Balance',
        flag: 'customerBalance',
      })
    }
    if (Object.keys(org).length && !reportId && reportName === 'Customer Balance') {
      fetchData()
    }
  }, [dateValue])

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format('MM/DD/YYYY'),
      endDate: moment(dateValue[1]).format('MM/DD/YYYY'),
      custId: reportId,
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.getCustomerBalanceDetails(obj)
      // console.log(result, 'Sales By getCustomerBalanceDetails')
      setTableCustInvoiceData(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: custDetails,
        fileName: 'Customer Details',
        salesValue: 'Customer Details',
        flag: 'cutomerBalDetailsWRID',
      })
    }
    if (Object.keys(org).length && reportId && reportName === 'Customer Balance Details') {
      fetchData()
    }
  }, [dateValue])

  return (
    <Row className="row details__page--content mt-3">
      <Col span={24} className="col-md-12 top__section p-0">
        <div className="page-header text-center pb-5">
          {/* <h4>Test</h4>  */}
          {reportId && (
            <h3 className="reports-headerspacing">
              {' '}
              {tableCustInvoiceData[0] ? tableCustInvoiceData[0].customername : reportId}{' '}
            </h3>
          )}
          {!reportId && <h3 className="reports-headerspacing"> {reportName}</h3>}
          {/* <span>Basis: Accrual</span> */}
          <h5>{`from ${dateValue[0]} to ${dateValue[1]}`}</h5>
          <div className="tags"> </div>
        </div>
        <Col span={24} className="p-0">
          {!reportId && reportName === 'Customer Balance' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={tableCustData}
              columns={custBalColumn}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const balance = pageData.reduce((sum, record) => sum + record.balance, 0)
                const receivedAmt = pageData.reduce((sum, record) => sum + record.received_amt, 0)
                const totalSale = pageData.reduce((sum, record) => sum + record.total_sale, 0)

                return (
                  <>
                    <Table.Summary.Row
                      className="ant-table-footer"
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>Total</Table.Summary.Cell>
                      <Table.Summary.Cell>{receivedAmt}</Table.Summary.Cell>
                      <Table.Summary.Cell>{totalSale}</Table.Summary.Cell>
                      <Table.Summary.Cell>{balance}</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={tableCustData}
                  columnDefs={singleLevelColumn(custBalColumn)}
                  defaultColDef={agGridDefaultColDef}
                  autoGroupColumnDef={agGridautoGroupColumnDef}
                  sideBar
                  enableRangeSelection
                  allowContextMenuWithControlKey
                  getContextMenuItems={agGetContextMenuItems}
                  onGridReady={onGridReady}
                  statusBar={agGridStatusBar}
                />
              </div>
            </>
          )}
          {reportId && reportName === 'Customer Balance Details' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={tableCustInvoiceData}
              columns={custDetails}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const dueAmt = pageData.reduce((sum, record) => sum + record.invoice_due_amount, 0)
                const amtWotax = pageData.reduce(
                  (sum, record) => sum + record.total_amt_without_tax,
                  0,
                )
                const total = pageData.reduce((sum, record) => sum + record.total, 0)

                return (
                  <>
                    <Table.Summary.Row
                      className="ant-table-footer"
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>Total</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>{dueAmt}</Table.Summary.Cell>
                      <Table.Summary.Cell>{amtWotax}</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>{total}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}

              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={tableCustInvoiceData}
                  columnDefs={singleLevelColumn(custDetails)}
                  defaultColDef={agGridDefaultColDef}
                  autoGroupColumnDef={agGridautoGroupColumnDef}
                  sideBar
                  enableRangeSelection
                  allowContextMenuWithControlKey
                  getContextMenuItems={agGetContextMenuItems}
                  onGridReady={onGridReady}
                  statusBar={agGridStatusBar}
                />
              </div>
            </>
          )}
        </Col>
      </Col>
    </Row>
  )
}
const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(CustomerReportDetails)

