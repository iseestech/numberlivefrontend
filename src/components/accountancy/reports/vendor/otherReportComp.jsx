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
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import Payable from '@/components/accountancy/JSON/Payable'

const poByVendorCol = [
  ...Payable.purchaseOrderByVendor,
  // {
  //   title: '#',
  //   dataIndex: 'key',
  //   key: 'key',
  //   // render: (text, record, index) => index + 1,
  // },
  // {
  //   title: 'Vendor Name',
  //   name: 'vendor_name',
  //   dataIndex: 'vendor_name',
  //   responsive: ['xs', 'sm'],
  //   // render: (text, record) => {
  //   //   return (
  //   //     <Link to={`/report/Purchase By Vendor/${record.venodr_id}`}>{record.vendor_name}</Link>
  //   //   )
  //   // }
  // },
  // {
  //   title: 'Order Count',
  //   dataIndex: 'order_count',
  //   name: 'order_count',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Total Amount',
  //   dataIndex: 'total_amount',
  //   name: 'total_amount',
  //   responsive: ['xs', 'sm'],
  // },
]
const payableSumCol = [
  ...Payable.payableSummary,
  // {
  //   title: '#',
  //   dataIndex: 'key',
  //   key: 'key',
  //   // render: (text, record, index) => index + 1,
  // },
  // {
  //   title: 'Date',
  //   name: 'Purchase_Date',
  //   dataIndex: 'Purchase_Date',
  //   responsive: ['xs', 'sm'],
  //   render: (text, record) => {
  //     return HelperFunction.dateFormatted(record.Purchase_Date)
  //   },
  // },
  // {
  //   title: 'Invoice No',
  //   name: 'invoice_no',
  //   dataIndex: 'invoice_no',
  //   responsive: ['xs', 'sm'],
  //   render: (text, record, index) => (
  //     <Link className="hrefLink" to={`/purchase/invoice/${record.invoice_no}`}>
  //       {' '}
  //       {record.invoice_no}
  //     </Link>
  //   ),
  // },
  // {
  //   title: 'Vendor Name',
  //   name: 'vendor_name',
  //   dataIndex: 'vendor_name',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Payment Status',
  //   dataIndex: 'payment_status',
  //   name: 'payment_status',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Balance Amount',
  //   dataIndex: 'balance_amt',
  //   name: 'balance_amt',
  //   responsive: ['xs', 'sm'],
  // },

  // {
  //   title: 'Total Without Tax',
  //   dataIndex: 'total_amt_without_tax',
  //   name: 'total_amt_without_tax',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Bill Amount',
  //   dataIndex: 'bill_amt',
  //   name: 'bill_amt',
  //   responsive: ['xs', 'sm'],
  // },
]
const payRecCol = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    filter: 'agTextColumnFilter',

    // render: (text, record, index) => index + 1,
  },
  {
    title: 'Date',
    name: 'payment_date',
    dataIndex: 'payment_date',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',

    render: (text, record) => {
      return HelperFunction.dateFormatted(record.payment_date)
    },
  },
  {
    title: 'Customer Name',
    name: 'customer_name',
    dataIndex: 'customer_name',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Payment No',
    name: 'payment_no',
    dataIndex: 'payment_no',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Account Name',
    dataIndex: 'act_name',
    name: 'act_name',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Payment Mode',
    dataIndex: 'payment_mode',
    name: 'payment_mode',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Received Amount',
    dataIndex: 'amount_recieved',
    name: 'amount_recieved',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
]
const debitNotesCol = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    filter: 'agTextColumnFilter',

    // render: (text, record, index) => index + 1,
  },
  {
    title: 'Date',
    name: 'pur_return_date',
    dataIndex: 'pur_return_date',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',

    render: (text, record) => {
      return HelperFunction.dateFormatted(record.pur_return_date)
    },
  },
  {
    title: 'Vendor Name',
    name: 'vendor_name',
    dataIndex: 'vendor_name',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Purchase Return No',
    name: 'purchase_return_no',
    dataIndex: 'purchase_return_no',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  //   {
  //     title: 'Status',
  //     name: 'accept_status',
  //     dataIndex: 'accept_status',
  //     responsive: ['xs', 'sm'],
  //   },
  {
    title: 'Amount',
    dataIndex: 'amount',
    name: 'amount',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
]
const creditNotesCol = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    filter: 'agTextColumnFilter',

    // render: (text, record, index) => index + 1,
  },
  {
    title: 'Date',
    name: 'sale_return_date',
    dataIndex: 'sale_return_date',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',

    render: (text, record) => {
      return HelperFunction.dateFormatted(record.sale_return_date)
    },
  },
  {
    title: 'Customer Name',
    name: 'customer_name',
    dataIndex: 'vendor_name',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Sale Return No',
    name: 'sale_return_no',
    dataIndex: 'sale_return_no',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    name: 'amount',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
]

const OtherReportComp = props => {
  const [poByVendorData, setPoByVendor] = useState([])
  const [payableSumData, setPayableSum] = useState([])
  const [payRecData, setPayRec] = useState([])
  const [debitNotesData, setDebitNotes] = useState([])
  const [creditNotesData, setCreditNotes] = useState([])
  const [gridApi, setGridApi] = useState()

  const { reportName, dateValue, reportId, handlePdfXlxCsv } = props

  // 1.
  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format('MM/DD/YYYY'),
      endDate: moment(dateValue[1]).format('MM/DD/YYYY'),
      //   custId: reportId,
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.poByVendor(obj)
      // console.log(result, 'Sales By getCustomerBalanceDetails')
      if (result && result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setPoByVendor(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: poByVendorCol,
        fileName: reportName,
        salesValue: reportName,
        flag: 'purchaseOrderByVendor',
      })
    }
    if (Object.keys(org).length && reportName === 'Purchase Order By Vendor') {
      fetchData()
    }
  }, [dateValue])

  //   2.
  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format('DD-MMM-YYYY'),
      endDate: moment(dateValue[1]).format('DD-MMM-YYYY'),
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.payableSummary(obj)
      // console.log(result, 'getVendorBalance')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setPayableSum(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: payableSumCol,
        fileName: reportName,
        salesValue: reportName,
        flag: 'payablesSummary',
      })
    }
    if (Object.keys(org).length && reportName === 'Payables Summary') {
      fetchData()
    }
  }, [dateValue])

  //   3.
  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format('MM/DD/YYYY'),
      endDate: moment(dateValue[1]).format('MM/DD/YYYY'),
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.paymentReceived(obj)
      // console.log(result, 'paymentDate')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setPayRec(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: payRecCol,
        fileName: 'Payments Received',
        salesValue: 'Payments Received',
        flag: 'paymentsReceived',
      })
    }
    if (Object.keys(org).length && reportName === 'Payments Received') {
      fetchData()
    }
  }, [dateValue])

  //   4.
  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format('MM/DD/YYYY'),
      endDate: moment(dateValue[1]).format('MM/DD/YYYY'),
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.vendorCredit(obj)
      // console.log(result, 'purchaseOrderDetails')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setDebitNotes(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: debitNotesCol,
        fileName: 'Debit Notes',
        salesValue: 'Debit Notes',
        flag: 'debitNotes',
      })
    }
    if (Object.keys(org).length && reportName === 'Debit Notes') {
      fetchData()
    }
  }, [dateValue])

  //   5.
  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format('MM/DD/YYYY'),
      endDate: moment(dateValue[1]).format('MM/DD/YYYY'),
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.saleCreditNote(obj)
      // console.log(result, 'receiveableSummary')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setCreditNotes(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: creditNotesCol,
        fileName: 'Credit Notes',
        salesValue: 'Credit Notes',
        flag: 'creditNotes',
      })
    }
    if (Object.keys(org).length && reportName === 'Credit Notes') {
      fetchData()
    }
  }, [dateValue])

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  return (
    <Row className="row details__page--content mt-3">
      <Col span={24} className="col-md-12 top__section p-0">
        <div className="page-header text-center pb-5">
          {/* <h4>Test</h4>  */}
          {/* {reportId && (
            <h3 className="reports-headerspacing">
              {' '}
              {tableCustInvoiceData[0] ? tableCustInvoiceData[0].customername : reportId}{' '}
            </h3>
          )} */}
          {!reportId && <h3 className="reports-headerspacing"> {reportName}</h3>}
          {/* <span>Basis: Accrual</span> */}
          <h5>{`from ${dateValue[0]} to ${dateValue[1]}`}</h5>
          <div className="tags"> </div>
        </div>
        <Col span={24} className="p-0">
          {/* {!params.reportId &&
        (params.report === 'Purchase Order By Vendor' ||
          params.report === 'Payables Summary' ||
          params.report === 'Payments Received' ||
          params.report === 'Debit Notes' ||
          params.report === 'Credit Notes') && ( */}

          {!reportId && reportName === 'Purchase Order By Vendor' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={poByVendorData}
              columns={poByVendorCol}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const total = pageData.reduce((sum, record) => sum + record.total_amount, 0)

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
                      <Table.Summary.Cell>{total}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={poByVendorData}
                  columnDefs={singleLevelColumn(poByVendorCol)}
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
          {!reportId && reportName === 'Payables Summary' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={payableSumData}
              columns={payableSumCol}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const totalAmtWoTax = pageData.reduce(
                  (sum, record) => sum + record.total_amt_without_tax,
                  0,
                )
                const balAmt = pageData.reduce((sum, record) => sum + record.balance_amt, 0)
                const billAmt = pageData.reduce((sum, record) => sum + record.bill_amt, 0)

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
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>{balAmt}</Table.Summary.Cell>
                      <Table.Summary.Cell>{totalAmtWoTax}</Table.Summary.Cell>
                      <Table.Summary.Cell>{billAmt}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={payableSumData}
                  columnDefs={singleLevelColumn(payableSumCol)}
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
          {!reportId && reportName === 'Payments Received' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={payRecData}
              columns={payRecCol}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const total = pageData.reduce((sum, record) => sum + record.amount_recieved, 0)

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
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
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
                  rowData={payRecData}
                  columnDefs={singleLevelColumn(payRecCol)}
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
          {!reportId && reportName === 'Debit Notes' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={debitNotesData}
              columns={debitNotesCol}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const total = pageData.reduce((sum, record) => sum + record.amount, 0)

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
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>{total}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={debitNotesData}
                  columnDefs={singleLevelColumn(debitNotesCol)}
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
          {!reportId && reportName === 'Credit Notes' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={creditNotesData}
              columns={creditNotesCol}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const total = pageData.reduce((sum, record) => sum + record.amount, 0)

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
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>{total}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={creditNotesData}
                  columnDefs={singleLevelColumn(creditNotesCol)}
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

export default connect(mapStateToProps)(OtherReportComp)

