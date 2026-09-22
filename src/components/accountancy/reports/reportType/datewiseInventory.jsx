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
} from '../../sales/aggrid/singleLevelColumn'

// const salesByCust = [
//   {
//     title: '#',
//     dataIndex: 'key',
//     key: 'key',
//     render: (text, record, index) => index + 1,
//   },
//   {
//     title: 'Customer Name',
//     name: 'customername',
//     dataIndex: 'customername',
//     responsive: ['xs', 'sm'],
//   },
//   {
//     title: 'Invoice Count',
//     name: 'invoice_count',
//     dataIndex: 'invoice_count',
//     responsive: ['xs', 'sm'],
//   },
//   {
//     title: 'Total Sale',
//     name: 'total_sale',
//     dataIndex: 'total_sale',
//     responsive: ['xs', 'sm'],
//   },
//   {
//     title: 'Sale Without Tax',
//     dataIndex: 'sale_without_tax',
//     name: 'sale_without_tax',
//     responsive: ['xs', 'sm'],
//   },
//   {
//     title: 'Action',
//     dataIndex: 'action',
//     name: 'action',
//     responsive: ['xs', 'sm'],
//     render: (text, record, index) => <Link to="/"> Click Here</Link>,

//   },
// ]

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
    name: 'item_name',
    dataIndex: 'item_name',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Purchase',
    name: 'Purchase',
    dataIndex: 'Purchase',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Purchase Return',
    name: 'Purchase_Return',
    dataIndex: 'Purchase_Return',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Sale',
    dataIndex: 'Sale',
    name: 'Sale',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Sate Return',
    name: 'Sale_Return',
    dataIndex: 'Sale_Return',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Opening Value',
    dataIndex: 'openingvalue',
    name: 'openingvalue',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Closing Value',
    dataIndex: 'closingvalue',
    name: 'closingvalue',
    responsive: ['xs', 'sm'],
    filter: 'agTextColumnFilter',
  },
  // {
  //   title: 'Action',
  //   dataIndex: '',
  //   name: '',
  //   responsive: ['xs', 'sm'],
  //   filter: 'agTextColumnFilter',
  // },
]

const DatewiseInventory = props => {
  const [tableItemData, setTableItemData] = useState([])
  const [tableCustInvoiceData, setTableCustInvoiceData] = useState([])
  const [gridApi, setGridApi] = useState()
  const { reportName, dateValue, reportId, handlePdfXlxCsv } = props

  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format('YYYY/MM/DD'),
      endDate: moment(dateValue[1]).format('YYYY/MM/DD'),
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.dateWiseInventory(obj)
      // console.log(result, 'DateByInventory')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setTableItemData(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: salesByItem,
        fileName: 'Datewise Inventory',
        salesValue: 'Datewise Inventory',
        flag: 'DatewiseInventory',
      })
    }
    if (Object.keys(org).length) {
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
              {tableCustInvoiceData[0] ? tableCustInvoiceData[0].customername : reportId}{' '}
            </h3>
          )}
          {!reportId && <h3 className="reports-headerspacing"> {reportName}</h3>}
          {/* <span>Basis: Accrual</span> */}
          <h5>{`from ${dateValue[0]} to ${dateValue[1]}`}</h5>
          <div className="tags"> </div>
        </div>
        <Col span={24} className="p-0">
          {/* <Table
            id="table__layout--css"
            pagination
            dataSource={tableItemData}
            columns={salesByItem}
            rowKey="id"
            // scroll={{ x: 691 }}
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
        </Col>
      </Col>
    </Row>
  )
}
const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(DatewiseInventory)

