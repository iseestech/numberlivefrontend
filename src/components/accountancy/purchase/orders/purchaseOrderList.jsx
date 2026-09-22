import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Button,
  Table,
  Checkbox,
  Tabs,
  Input,
  Space,
  Menu,
  Dropdown,
  Form,
  DatePicker,
  Modal,
  Upload,
  message,
} from 'antd'
import { Link, useLocation } from 'react-router-dom'
import ReactDOMServer from 'react-dom/server'
import { AgGridReact } from 'ag-grid-react'
// import { Checkbox } from 'antd'
import {
  DownOutlined,
  ReloadOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  UploadOutlined,
  LeftOutlined,
} from '@ant-design/icons'
import queryString from 'query-string'
import { Helmet } from 'react-helmet'
import store from 'store'
import { connect } from 'react-redux'
import axios from 'axios'
import SalesColumns from '@/components/accountancy/JSON/SalesColumnNew'

import PurchaseService from '@/services/purchase'
import HelperFunction from '@/services/helper'
import ReceiptPrint from '@/components/accountancy/common/receipt'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import moment from 'moment'
import tableData from './data.json'
// import { GridApi } from 'ag-grid-community'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '../../sales/aggrid/singleLevelColumn'
import sampleFile from './productBulkUpload.xlsx'
// import { addPostcssPlugins } from 'customize-cra'
// import { SvgPathAnnotation } from 'react-stockcharts/lib/annotation'
// init("user_ltpFnmyPN6p54mp0Uvz90");
const { RangePicker } = DatePicker
const { TabPane } = Tabs

const filterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    const dateAsString = cellValue
    if (dateAsString == null) return -1
    const dateParts = dateAsString.split('/')
    const cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]))
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1
    }
    return 0
  },
  browserDatePicker: true,
  minValidYear: 2000,
}

const mapStateToProps = ({ router }) => ({
  routerData: router,
})
const tableCols = [
  {
    field: 'key',
    headerName: 'key',
    filter: 'agNumberColumnFilter',
  },
  {
    field: 'purchase_order_no',
    headerName: 'Purchase No#',
    filter: 'agTextColumnFilter',
  },
  { field: 'reference', headerName: 'Reference', filter: 'agTextColumnFilter' },
  { field: 'vendorName', headerName: 'Vendor Name', filter: 'agTextColumnFilter' },
  {
    field: 'poDate',
    headerName: 'Order Date',
    filter: 'false',
    filterParams: { filterParams },
  },
  { field: 'amount', headerName: 'Amount', filter: 'agNumberColumnFilter' },
  { field: 'accept_status', headerName: 'Status', filter: 'agTextColumnFilter' },
  {
    field: 'actions',
    headerName: 'Actions',
    filter: false,
    cellRenderer: params => {
      const dt = params?.data
      const poNumber = dt && dt.purchase_order_no
      // put the value in bold
      return (
        <Link to={`/purchase/order/${poNumber}`}>
          <span className="viewIcon">
            {/* <EditOutlined /> */}
            <EyeOutlined />
          </span>
        </Link>
      )
    },
  },
]
const tableColumns = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    className: 'srNo',
    filter: 'agNumberColumnFilter',
    checkboxSelection: params => {
      return !!params.data && params.data.accept_status === 'DRAFT'
    },
    // render: (text, record, index) => index + 1,
  },
  {
    title: 'Purchase No#',
    dataIndex: 'purchase_order_no',
    key: 'purchase_order_no',
    sorter: (a, b) => a.purchase_order_no.localeCompare(b.purchase_order_no),
    showSorterTooltip: false,
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Reference',
    dataIndex: 'reference',
    key: 'reference',
    filter: 'agTextColumnFilter',
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vendorName',
    key: 'vendorName',
    sorter: (a, b) => a.vendorName.localeCompare(b.vendorName),
    filter: 'agTextColumnFilter',

    // render: (text, record) => {
    //   return (
    //     <Link to={`/purchase/order/${record.id}`}>{`${record.firstName} ${record.lastName}`}</Link>
    //   )
    // },
  },
  {
    title: 'Order Date',
    dataIndex: 'poDate',
    key: 'poDate',
    filter: 'agTextColumnFilter',

    sorter: (a, b) => a.poDate.localeCompare(b.poDate),
    render: (text, record) => {
      return HelperFunction.dateFormatted(record.poDate)
    },
  },
  // {
  //   title: 'Delivery Date',
  //   dataIndex: 'expiry_date',
  //   key: 'expiry_date',
  // },
  // {
  //   title: 'Order No',
  //   dataIndex: 'order_no',
  //   key: 'order_no',
  // },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    filter: 'agNumberColumnFilter',
    isCustCellRender: true,
    cellRenderer: HelperFunction.renderCellAmt,
    sorter: (a, b) => HelperFunction.sortTableColumn(a, b, 'amount', 'number'),
  },
  {
    title: 'Status',
    dataIndex: 'accept_status',
    key: 'accept_status',
    filter: 'agTextColumnFilter',
    sorter: (a, b) => a.accept_status.localeCompare(b.accept_status),
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    className: 'actionCol',
    cellRenderer: params => {
      const dt = params?.data
      const poNumber = dt && dt.purchase_order_no
      // console.log(text, record)
      return (
        <Link to={`/purchase/order/${poNumber}`}>
          <span className="viewIcon">
            <EyeOutlined />
          </span>
        </Link>
      )
    },
  },
]

const PurchaseOrderList = routerData => {
  const location = useLocation()
  const [quotations, getQuotations] = useState([])
  const [total, setTotal] = useState(0)
  const [reportType, setReportType] = useState('default')
  const [isShownReciept, setShownReciept] = useState(false)
  const [quotationList, getQuotationsList] = useState({})
  const [csvData, setCSVData] = useState([])
  const [baseData, setBaseData] = useState([])

  // Table col for AddToPI
  const selectTableCols = [
    {
      title: 'Purchase Order No',
      dataIndex: 'purchase_order_no',
    },
    {
      title: 'Vendor Name',
      dataIndex: 'VendorName',
    },
    {
      title: 'Bill Number',
      render: (text, record) => {
        return (
          <Form onFinish={values => convertToPi(values.action, text)}>
            <Form.Item
              name="action"
              rules={[
                {
                  required: true,
                  message: 'Enter Bill Number',
                },
              ]}
            >
              <div>
                <Input
                  placeholder="Enter Invoice Number"
                  style={{ width: '50%', marginRight: '5px' }}
                />
                <Button type="primary" htmlType="submit">
                  Convert
                </Button>
              </div>
            </Form.Item>
          </Form>
        )
      },
    },
  ]

  const [selectArray, setSelectArray] = useState([])
  const [selectPiModal, setSelectPiModal] = useState(false)

  const convertToPi = (val, text) => {
    const pidata = `vendor_id=${text.vendor_id}&orderId=${text.purchase_order_no}&status=APPROVE&purchaseNumber=${val}`
    const fetchDataPi = async () => {
      const result = await PurchaseService.purchaseConvertToInvoice(pidata, 'get')
      // const result = await PurchaseService.approvePurchaseInvoice(data, 'get')
      if (result && result?.data?.statusCode === 200) {
        message.success(`Sucseesfully converted to Invoice`)
        // delete row
        setSelectArray(prev => {
          return prev.filter(ent => ent.purchase_order_no !== text.purchase_order_no)
        })
      }
    }
    fetchDataPi()
  }

  const rowSelectionType = 'multiple'
  // function will trigger once selection changed
  const onSelectionChanged = event => {
    setSelectArray(event.api.getSelectedRows())
  }
  const isRowSelectable = params => {
    return !!params.data && params.data.accept_status === 'DRAFT'
  }

  // const [rowData] = useState([
  //   { make: 'Toyota', model: 'Celica', price: 35000 },
  //   { make: 'Ford', model: 'Mondeo', price: 32000 },
  //   { make: 'Porsche', model: 'Boxter', price: 72000 },
  // ]);

  // const [columnDefs] = useState([
  //   { field: 'make' },
  //   { field: 'model' },
  //   { field: 'price' },
  // ]);

  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), [])
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])
  const [gridApi, setGridApi] = useState()
  const [rowData, setRowData] = useState()
  const [columnDefs, setColumnDefs] = useState([
    { field: 'athlete', filter: 'agTextColumnFilter', minWidth: 200 },
    { field: 'age' },
    { field: 'country', minWidth: 180 },
    { field: 'year' },
    { field: 'date', minWidth: 150 },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ])
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      // allow every column to be aggregated
      enableValue: true,
      // allow every column to be grouped
      enableRowGroup: true,
      // allow every column to be pivoted
      enablePivot: true,
      sortable: true,
      filter: true,
      floatingFilter: true,
    }
  }, [])
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    }
  }, [])

  // const onGridReady = useCallback(params => {
  //   console.log(params, 'test')
  //   fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
  //     .then(resp => resp.json())
  //     .then(data => {
  //       setRowData(data)
  //       setGridApi(params.columnApi)
  //     })
  // }, [])

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  const [page, setpage] = useState(1)
  useEffect(() => {
    const fetchData = async () => {
      const org = store.get('selectedOrg')
      // console.log(org, 'org')
      const result = await PurchaseService.purchaseOrderListNew(org)
      // console.log(result, 'ress111')
      // const params1 = queryString.parse(routerData?.location?.search)
      // console.log('params', params1.report)
      // const rt = params1.report && setReportType(params1.report)
      if (result && result.length) {
        const totalVal = result.reduce((partialSum, { amount }) => partialSum + amount, 0)
        const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
        // console.log('total', csvDataVal)
        if (result.length) {
          result.forEach((ele, i) => {
            ele.key = i + 1
          })
        }
        getQuotations(result)
        setCSVData(csvDataVal)
        setBaseData(result)
        setTotal(totalVal)
      } else {
        getQuotations([])
        setCSVData([])
        setTotal(0)
      }
    }

    fetchData()
  }, [routerData?.location?.search, page])

  const [data, setData] = React.useState([])
  const fileName = 'myfile' // here enter filename for your excel file

  const hideColumn = e => {
    // GridApi
    console.log(`checked = ${e.target.checked}`)
    console.log(gridApi, 'gridApi')
    gridApi.setColumnVisible('key', !e.target.checked)
  }

  const onHandleChange = (e, val) => {
    // console.log(e, val)
  }
  const handleRecieptModal = () => {
    setShownReciept(!isShownReciept)
  }
  const sort = async value => {
    //  // console.log(value.monthwise.format('MM'), 'ss')

    const org = store.get('selectedOrg')
    if (value.datewise) {
      // console.log(value.datewise[0], 'date')
      const st = value.datewise[0].format('MM/DD/YYYY')
      const et = value.datewise[1].format('MM/DD/YYYY')
      const result = await PurchaseService.getPurchaseOrderDateWise(
        `startDate=${st}&endDate=${et}&orgCode=${org.orgCode}`,
      )
      getQuotations(result)
    } else if (value.monthwise) {
      // console.log(value.monthwise, 'month')
      const mt = value.monthwise.format('MM')
      const yr = value.monthwise.format('YYYY')
      const result = await PurchaseService.getPurchaseOrderMonthWise(
        `year=${yr}&month=${mt}&orgCode=${org.orgCode}`,
      )
      getQuotations(result)
    } else if (value.yearwise) {
      // console.log(value.yearwise, 'month')
      // const mt = value.monthwise.format('MM')
      const yr = value.yearwise.format('YYYY')
      const result = await PurchaseService.getPurchaseOrderYearWise(
        `Year=${yr}&orgCode=${org.orgCode}`,
      )
      getQuotations(result)
    }
  }

  const search = value => {
    // console.log(moment(value),"new Date(value)")
    // const tempVal = new Date(value) !== 'Invalid Date' ? "2021-10-17" : value;
    // console.log(tempVal,"tempVal")
    const filterTableVal = baseData.filter(o =>
      Object.keys(o).some(k =>
        String(o[k])
          .toLowerCase()
          .includes(value.toLowerCase()),
      ),
    )
    if (filterTableVal.length) {
      filterTableVal.forEach((ele, i) => {
        ele.key = i + 1
      })
    }
    getQuotations(filterTableVal)
  }

  const sendEmail = e => {
    e.preventDefault()
    const html = ReactDOMServer.renderToStaticMarkup(<div>Hello</div>)
    // console.log(html.toString(), 'html.toString()')
    const dataVal = {
      service_id: 'service_eg5541j',
      template_id: 'template_77kq3oo',
      user_id: 'user_ltpFnmyPN6p54mp0Uvz90',
      template_params: {
        username: 'Ajinkya',
        message: html.toString(),
      },
    }

    // code fragment
    axios
      .post('https://api.emailjs.com/api/v1.0/email/send', dataVal)
      .then(function(response) {
        // console.log('success', response)
      })
      .catch(function(error) {
        // console.log('error', error)
      })

    // $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
    //   type: 'POST',
    //   data: JSON.stringify(data),
    //   contentType: 'application/json'
    // }).done(function() {
    //   alert('Your mail is sent!');
    // }).fail(function(error) {
    //   alert('Oops... ' + JSON.stringify(error));
    // });
  }

  // console.log('reportType', reportType)
  // console.log(routerData, 'router')
  const routeName = location?.pathname?.split('/')[2]
  const { accepted, sent, draft, invoiced, declined } = quotationList
  // const params1 = queryString.parse(routerData.location.search)
  // const routeName1 = routerData.location.search

  // console.log('params', params1.report)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-4">
        <div>
          <Input.Search placeholder="Search by..." enterButton onSearch={search} />
        </div>
        {selectArray.length > 0 && (
          <Button
            type="primary"
            size="medium"
            className="text-center w-10 mb-1"
            style={{ marginLeft: '3px' }}
            htmlType="submit"
            onClick={() => {
              setSelectPiModal(true)
            }}
          >
            Convert To PI
          </Button>
        )}
        {/* <div>
          <Button>
            <Checkbox onChange={hideColumn}>Hide Key Column</Checkbox>
          </Button>
        </div> */}
        <div className="text-end">
          <Button color="secondary" className="me-2">
            <Dropdown trigger={["click"]}
              popupRender={ () =>
                <ExportOptions
                  handleRecieptModal={handleRecieptModal}
                  csvData={csvData}
                  apiData={quotations}
                  columns={tableColumns}
                  fileName="Purchase Order List"
                />
              }
              className="me-2 mb-2"
            >
              <a className="ant-dropdown-link">
                Export As <DownOutlined />
              </a>
            </Dropdown>
          </Button>

          <Button type="primary" size="medium" className="text-center w-10 mb-1" htmlType="submit">
            <Link
              to={`/purchase/${routeName.substring(0, routeName.length - 1)}/create`}
              className="text-white"
            >
              Create {routeName}
            </Link>
          </Button>
        </div>
      </div>
      {/* <Form> */}
      {/* <div className="row"> */}

      <div className="row">
        <div className="col-md-12">
          {/* <Table
            id="table__layout--css"
            rowKey="id"
            columns={tableColumns}
            // dataSource={quotations}
            dataSource={quotations || []}
            pagination
            showSorterTooltip={false}
            // footer={dataVal => {
            //   return <div>Summary: {dataVal.reduce((sum, record) => sum + record.amount, 0)} </div>
            // }}
          /> */}
        </div>
        <div className="ag-theme-alpine agggrid--table__container">
          {/* <AgGridReact rowData={quotations} columnDefs={tableField} /> */}
          <AgGridReact
          theme={"legacy"}
            rowData={quotations}
            columnDefs={singleLevelColumn(tableColumns)}
            defaultColDef={agGridDefaultColDef}
            autoGroupColumnDef={agGridautoGroupColumnDef}
            sideBar
            enableRangeSelection
            allowContextMenuWithControlKey
            getContextMenuItems={agGetContextMenuItems}
            onGridReady={onGridReady}
            statusBar={agGridStatusBar}
            rowSelection={rowSelectionType}
            onSelectionChanged={onSelectionChanged}
            isRowSelectable={isRowSelectable}
          />
        </div>

        {/* <div className="col-md-12">&nbsp;</div>
        <div className="col-md-8">&nbsp;</div>
        <div className="col-md-4">
          <div style={{ border: '1px dashed', padding: '10px 0' }}>
            <div className="row">
              <div className="col-md-2">&nbsp;</div>
              <div className="col-md-5 text-end">
                <strong>Total :</strong>
              </div>
              <div className="col-md-5 text-start">
                <strong>{total}</strong>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={handleRecieptModal}
        quoteData={quotations || []}
        salesValue="Purchase Order Report"
        flag="Purchase Order List"
      />
      {/* <Tabs defaultActiveKey="1">
        <TabPane tab="All" key="1">
          <Table rowKey="purchase_id" columns={tableColumns} dataSource={quotations} pagination={false} />
        </TabPane>
        <TabPane tab={`Draft (${draft && draft.length})`} key="2">
          <Table rowKey="purchase_id" columns={tableColumns} dataSource={draft} pagination={false} />
        </TabPane>
        <TabPane tab={`Sent (${sent && sent.length})`} key="3">
          <Table rowKey="purchase_id" columns={tableColumns} dataSource={sent} pagination={false} />
        </TabPane>
        <TabPane tab={`Declined (${declined && declined.length})`} key="4">
          <Table rowKey="purchase_id" columns={tableColumns} dataSource={declined} pagination={false} />
        </TabPane>
        <TabPane tab={`Accepted (${accepted && accepted.length})`} key="5">
          <Table rowKey="purchase_id" columns={tableColumns} dataSource={accepted} pagination={false} />
        </TabPane>
        <TabPane tab={`Invoiced (${invoiced && invoiced.length})`} key="6">
          <Table rowKey="purchase_id" columns={tableColumns} dataSource={invoiced} pagination={false} />
        </TabPane>
      </Tabs> */}

      {selectPiModal && (
        <Modal
          title={null}
          centered
          open={selectPiModal}
          onOk={() => {
            setSelectPiModal(false)
            setpage(pre => pre + 1)
          }}
          onCancel={() => {
            setSelectPiModal(false)
            setpage(pre => pre + 1)
          }}
          footer={null}
          width={800}
        >
          <Table columns={selectTableCols} dataSource={selectArray} pagination={{ pageSize: 6 }} />
        </Modal>
      )}
    </div>
  )
}

export default connect()(PurchaseOrderList)
