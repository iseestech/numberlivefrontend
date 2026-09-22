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
    title: 'Product Name',
    name: 'product_name',
    dataIndex: 'product_name',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
    HelperFunction: true,
    // render: (text, record, index) => (
    //   <Link className="hrefLink" to={`/products-and-services/product/${record.product_id}`}>
    //     {' '}
    //     {record.product_name}
    //   </Link>
    // ),
    isCustCellRender: true,
    cellRenderer: params => {
      const dt = params?.data || {}
      return (
        <Link className="hrefLink" to={`/products-and-services/product/${dt.product_id}`}>
          {' '}
          {dt.invoice_no}
        </Link>
      )
    },
  },
  {
    title: 'Buy Quantity',
    name: 'buy_qty',
    dataIndex: 'buy_qty',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Average Price',
    name: 'average_price',
    dataIndex: 'average_price',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Amount',
    dataIndex: 'Amount',
    name: 'Amount',
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

    // render: (text, record, index) => index + 1,
  },
  {
    title: 'Purchase Date',
    name: 'Purchase_Date',
    dataIndex: 'Purchase_Date',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
    isCustCellRender: true,
    // cellRenderer: params => {
    //   const dt = params?.data || {}
    //   return (
    //     <Link className="hrefLink" to={`/sales/invoice/${dt.invoice_no}`}>
    //       {' '}
    //       {dt.invoice_no}
    //     </Link>
    //   )
    // },
    cellRenderer: params => {
      return HelperFunction.dateFormatted(params.Purchase_Date)
    },
  },
  {
    title: 'Invoice No',
    name: 'invoice_no',
    dataIndex: 'invoice_no',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
    isCustCellRender: true,
    cellRenderer: params => {
      const dt = params?.data || {}
      return (
        <Link className="hrefLink" to={`/purchase/invoice/${dt.invoice_no}`}>
          {dt.invoice_no}
        </Link>
      )
    },
  },
  {
    title: 'Status',
    name: 'payment_status',
    dataIndex: 'payment_status',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Due Amount',
    name: 'invoice_due_amount',
    dataIndex: 'invoice_due_amount',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Amount',
    name: 'total',
    dataIndex: 'total',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },

  // {
  //   title: 'Sale Without Tax',
  //   dataIndex: 'sale_without_tax',
  //   name: 'sale_without_tax',
  //   responsive: ['xs', 'sm'],
  // },
]

const PurchaseReportDetails = props => {
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
      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Vendor Name',
      name: 'vendor_name',
      dataIndex: 'vendor_name',
      responsive: ['xs', 'sm'],
    },
    {
      title: 'Invoice Count',
      name: 'invoice_count',
      dataIndex: 'invoice_count',
      responsive: ['xs', 'sm'],
    },
    {
      title: 'Total Purchase',
      name: 'total_purchase',
      dataIndex: 'total_purchase',
      responsive: ['xs', 'sm'],
    },
    {
      title: 'Purchase Without Tax',
      dataIndex: 'total_without_tax',
      name: 'total_without_tax',
      responsive: ['xs', 'sm'],
    },
    {
      title: 'Action',
      dataIndex: 'action',
      name: 'action',
      responsive: ['xs', 'sm'],
      render: (text, record, index) => (
        <Link className="hrefLink" to={`/report/${reportName}/${record.venodr_id}`}>
          {' '}
          Click Here
        </Link>
      ),
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
      const result = await ReportServices.purchaseByVendor(obj)
      // console.log(result, 'Sales By Vendor')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setTableCustData(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: purchaseByVendor,
        fileName: reportName,
        salesValue: reportName,
        flag: 'purchaseByVendor',
      })
    }
    if (Object.keys(org).length && !reportId && reportName === 'Purchase By Vendor') {
      fetchData()
    }
  }, [dateValue])

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
      const result = await ReportServices.pruchaseByItems(obj)
      // console.log(result, 'salesByItems')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setTableItemData(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: salesByItem,
        fileName: reportName,
        salesValue: reportName,
        flag: 'purchaseByItem',
      })
    }
    if (Object.keys(org).length && reportName === 'Purchase By Item') {
      fetchData()
    }
  }, [dateValue])

  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format('MM/DD/YYYY'),
      endDate: moment(dateValue[1]).format('MM/DD/YYYY'),
      vendorId: reportId,
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.purchaseVendorDetails(obj)
      // console.log(result, 'salesByItems', reportId)
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setTableCustInvoiceData(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: salesByCustDetails,
        fileName: reportName,
        salesValue: reportName,
        flag: 'purchaseByVendorWRID',
      })
    }
    if (Object.keys(org).length && reportId && reportName === 'Purchase By Vendor') {
      fetchData()
    }
  }, [dateValue])

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

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
          {!reportId && reportName === 'Purchase By Vendor' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={tableCustData}
              columns={purchaseByVendor}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const totalAmtWoTax = pageData.reduce(
                  (sum, record) => sum + record.total_without_tax,
                  0,
                )
                const total = pageData.reduce((sum, record) => sum + record.total_without_tax, 0)

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
                      <Table.Summary.Cell>{totalAmtWoTax}</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={tableCustData}
                  columnDefs={singleLevelColumn(purchaseByVendor)}
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

          {!reportId && reportName === 'Purchase By Item' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={tableItemData}
              columns={salesByItem}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const total = pageData.reduce((sum, record) => sum + record.Amount, 0)
                const avgPrice = pageData.reduce((sum, record) => sum + record.average_price, 0)

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
                      <Table.Summary.Cell>{avgPrice}</Table.Summary.Cell>
                      <Table.Summary.Cell>{total}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={tableItemData}
                  columnDefs={singleLevelColumn(salesByItem)}
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

          {reportId && reportName === 'Purchase By Vendor' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={tableCustInvoiceData}
              columns={salesByCustDetails}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const dueAmt = pageData.reduce((sum, record) => sum + record.invoice_due_amount, 0)
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
                      <Table.Summary.Cell>{dueAmt}</Table.Summary.Cell>
                      <Table.Summary.Cell>{total}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={tableCustInvoiceData}
                  columnDefs={singleLevelColumn(salesByCustDetails || [])}
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

export default connect(mapStateToProps)(PurchaseReportDetails)

