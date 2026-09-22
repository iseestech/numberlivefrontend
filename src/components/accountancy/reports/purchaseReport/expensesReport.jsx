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

const salesByItem = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    filter: 'agTextColumnFilter',

    // render: (text, record, index) => index + 1,
  },
  {
    title: 'Date',
    name: 'date',
    dataIndex: 'date',
    responsive: ['xs', 'sm'],

    filter: 'agTextColumnFilter',

    render: (text, record) => {
      return HelperFunction.dateFormatted(record.date)
    },
  },
  {
    title: 'Expense No',
    name: 'expense_no',
    dataIndex: 'expense_no',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Payment Mode',
    name: 'payment_mode',
    dataIndex: 'payment_mode',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Amount',
    dataIndex: 'total',
    name: 'total',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
]

const salesByCustDetails = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    filter: 'agTextColumnFilter',

    render: (text, record, index) => index + 1,
  },
  {
    title: 'Expense Account',
    name: 'expenses_act',
    dataIndex: 'expenses_act',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Total Expense',
    name: 'totalexpense',
    dataIndex: 'totalexpense',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
]

const ExpenseReportDetails = props => {
  const [tableCustData, setTableCustData] = useState([])
  const [tableItemData, setTableItemData] = useState([])
  const [tableCustInvoiceData, setTableCustInvoiceData] = useState([])
  const [gridApi, setGridApi] = useState()

  const { reportName, dateValue, reportId, handlePdfXlxCsv } = props

  const purchaseByVendor = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Vendor Name',
      name: 'vendor_name',
      dataIndex: 'vendor_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Invoice Count',
      name: 'invoice_count',
      dataIndex: 'invoice_count',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Total Purchase',
      name: 'total_purchase',
      dataIndex: 'total_purchase',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Purchase Without Tax',
      dataIndex: 'total_without_tax',
      name: 'total_without_tax',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      name: 'action',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/report/${reportName}/${dt.venodr_id}`}>
            {' '}
            Click Here
          </Link>
        )
      },
    },
  ]

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
      const result = await ReportServices.expenseDetails(obj)
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      // console.log(result, 'Sales By Vendor')
      setTableItemData(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: salesByItem,
        fileName: reportName,
        salesValue: reportName,
        flag: 'expenseDetails',
      })
    }
    if (Object.keys(org).length && reportName === 'Expense Details') {
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
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.categoryExpense(obj)
      // console.log(result, 'salesByItems')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setTableCustData(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: salesByCustDetails,
        fileName: reportName,
        salesValue: reportName,
        flag: 'expenseByCategory',
      })
    }
    if (Object.keys(org).length && reportName === 'Expense by Category') {
      fetchData()
    }
  }, [dateValue])

  //   useEffect(() => {
  //     const org = localStorage.getItem('selectedOrg')
  //       ? JSON.parse(localStorage.getItem('selectedOrg'))
  //       : {}
  //     const obj = {
  //       orgCode: org.orgCode,
  //       startDate: moment(dateValue[0]).format('MM/DD/YYYY'),
  //       endDate: moment(dateValue[1]).format('MM/DD/YYYY'),
  //       vendorId: reportId,
  //     }
  //     // console.log('Obj', obj)
  //     const fetchData = async () => {
  //       const result = await ReportServices.purchaseVendorDetails(obj)
  //       // console.log(result, 'salesByItems', reportId)
  //       setTableCustInvoiceData(result)
  //     }
  //     if (Object.keys(org).length && reportId) {
  //       fetchData()
  //     }
  //   }, [dateValue])

  // console.log
  // console.log("Sale By Customer",props);
  return (
    <Row className="row details__page--content mt-3">
      <Col span={24} className="col-md-12 top__section p-0">
        <div className="page-header text-center pb-5">
          {/* <h4>Test</h4>  */}
          {reportId && (
            <h3 className="reports-headerspacing">
              {' '}
              {tableCustInvoiceData[0] ? tableCustInvoiceData[0].vendor_name : reportId}{' '}
            </h3>
          )}
          {!reportId && <h3 className="reports-headerspacing"> {reportName}</h3>}
          {/* <span>Basis: Accrual</span> */}
          <h5>{`from ${dateValue[0]} to ${dateValue[1]}`}</h5>
          <div className="tags"> </div>
        </div>
        <Col span={24} className="p-0">
          {!reportId && reportName === 'Expense by Category' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={tableCustData}
              columns={salesByCustDetails}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const total = pageData.reduce((sum, record) => sum + record.totalexpense, 0)

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
                      <Table.Summary.Cell>{total}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={tableCustInvoiceData}
                  columnDefs={singleLevelColumn(salesByCustDetails)}
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

          {!reportId && reportName === 'Expense Details' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={tableItemData}
              columns={salesByItem}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
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
                  columnDefs={singleLevelColumn(salesByCustDetails)}
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

export default connect(mapStateToProps)(ExpenseReportDetails)

