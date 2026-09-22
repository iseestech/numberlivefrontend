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
import { AgGridReact } from 'ag-grid-react'
import HelperFunction from '@/services/helper'
import moment from 'moment'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '../sales/aggrid/singleLevelColumn'

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
    isCustCellRender: true,
    cellRenderer: params => {
      const dt = params?.data || {}
      return (
        <Link className="hrefLink" to={`/products-and-services/product/${dt.product_id}`}>
          {' '}
          {dt.product_name}
        </Link>
      )
    },
  },
  {
    title: 'Sold Quantity',
    name: 'sold_qty',
    dataIndex: 'sold_qty',
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
    title: 'Estimate Date',
    name: 'estimate_date',
    dataIndex: 'estimate_date',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
    isCustCellRender: true,
    cellRenderer: params => {
      const dt = params?.data || {}
      return HelperFunction.dateFormatted(dt.estimate_date)
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
        <Link className="hrefLink" to={`/sales/invoice/${dt.invoice_no}`}>
          {' '}
          {dt.invoice_no}
        </Link>
      )
    },
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

const SaleByCustomer = props => {
  const [tableCustData, setTableCustData] = useState([])
  const [tableItemData, setTableItemData] = useState([])
  const [tableCustInvoiceData, setTableCustInvoiceData] = useState([])

  const [gridApi, setGridApi] = useState()

  const { reportName, dateValue, reportId, updateChildComp, handlePdfXlxCsv } = props

  const salesByCust = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Customer Name',
      name: 'customername',
      dataIndex: 'customername',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        const custId = dt.customer_id
        return (
          <Link className="hrefLink" to={`/report/${reportName}/${custId}`}>
            {' '}
            {dt.customername}
          </Link>
        )
      },
    },
    {
      title: 'Invoice Count',
      name: 'invoice_count',
      dataIndex: 'invoice_count',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Total Sale',
      name: 'total_sale',
      dataIndex: 'total_sale',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Sale Without Tax',
      dataIndex: 'sale_without_tax',
      name: 'sale_without_tax',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      name: 'action',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/report/${reportName}/${dt.customer_id}`}>
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
      const result = await ReportServices.salesByCustomer(obj)
      // console.log(result, 'salesByCustomer')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setTableCustData(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: salesByCust,
        fileName: 'Sales By Customer',
        salesValue: 'Sales By Customer',
        flag: 'salesByCustomer',
      })
    }
    if (Object.keys(org).length && !reportId && reportName === 'Sales By Customer') {
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
      const result = await ReportServices.salesByItems(obj)
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
        fileName: 'Sales By Items',
        salesValue: 'Sales By Items',
        flag: 'salesByItems',
      })
    }
    if (Object.keys(org).length && !reportId && reportName === 'Sales By Item') {
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
      custId: reportId,
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.salesCustomerDetails(obj)
      // console.log(result, 'custDetails')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setTableCustInvoiceData(result || [])
      handlePdfXlxCsv({
        apiData: result,
        columns: salesByCustDetails,
        fileName: 'Sales By Customer',
        salesValue: 'Sales By Customer Details',
        flag: 'SalesByCustomerDetails',
        info: {
          name: reportId ? result && result[0].customername : '',
        },
      })
    }
    if (Object.keys(org).length && reportId && reportName === 'Sales By Customer') {
      fetchData()
    }
  }, [])

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

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
          {!reportId && reportName === 'Sales By Customer' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={tableCustData}
              columns={salesByCust}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const saleWoTax = pageData.reduce((sum, record) => sum + record.sale_without_tax, 0)
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
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>{totalSale}</Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <span>{saleWoTax}</span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={tableCustData}
                  columnDefs={singleLevelColumn(salesByCust)}
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

          {!reportId && reportName === 'Sales By Item' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={tableItemData}
              columns={salesByItem}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const amount = pageData.reduce((sum, record) => sum + record.Amount, 0)
                // const totalSale = pageData.reduce((sum, record) => sum + record.total_sale, 0)
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
                      <Table.Summary.Cell>{amount}</Table.Summary.Cell>
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

          {reportId && reportName === 'Sales By Customer' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={tableCustInvoiceData}
              columns={salesByCustDetails}
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

export default SaleByCustomer

