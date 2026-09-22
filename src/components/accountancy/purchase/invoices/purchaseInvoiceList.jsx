import React, { useState, useEffect, useCallback } from 'react'
import {
  Button,
  Table,
  Tabs,
  Modal,
  Upload,
  Dropdown,
  Space,
  Form,
  message,
  Input,
  DatePicker,
} from 'antd'
import {
  UploadOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  UnderlineOutlined,
} from '@ant-design/icons'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import { Link } from 'react-router-dom'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import SalesColumns from '@/components/accountancy/JSON/SalesColumnNew'

import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PurchaseService from '@/services/purchase'
import HelperFunction from '@/services/helper'
import ReceiptPrint from '@/components/accountancy/common/receipt'
import store from 'store'
import tableData from './data.json'
import CSVFILE from './sample.csv?raw'
import { useLocation } from 'react-router-dom'
import WithRouter from '@/WithRouter'
const { RangePicker } = DatePicker
const { TabPane } = Tabs

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const tableColumns = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    className: 'srNo',
    filter: 'agTextColumnFilter',

    // render: (text, record, index) => index + 1,
  },
  {
    title: 'Bill No',
    dataIndex: 'purchaseNumber',
    key: 'purchaseNumber',
    filter: 'agTextColumnFilter',

    sorter: (a, b) => a.purchaseNumber.localeCompare(b.purchaseNumber),
  },
  {
    title: 'Invoice No',
    dataIndex: 'invoice_no',
    key: 'invoice_no',
    filter: 'agTextColumnFilter',

    sorter: (a, b) => a.invoice_no.localeCompare(b.invoice_no),
  },
  // {
  //   title: 'Reference',
  //   dataIndex: 'reference',
  //   key: 'reference',
  // },
  {
    title: 'Vendor Name',
    dataIndex: 'vendor_name',
    key: 'vendorName',
    filter: 'agTextColumnFilter',

    sorter: (a, b) => a.vendor_name.localeCompare(b.vendor_name),

    // render: (text, record) => {
    //   return (
    //     <Link to={`/purchase/invoice/${record.id}`}>
    //       {`${record.firstName} ${record.lastName}`}
    //     </Link>
    //   )
    // },
  },
  {
    title: 'Purchase Date',
    dataIndex: 'purchaseDate',
    key: 'purchaseDate',
    filter: 'agTextColumnFilter',

    sorter: (a, b) => a.purchaseDate.localeCompare(b.purchaseDate),
    render: (text, record) => {
      return HelperFunction.dateFormatted(record.purchaseDate)
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
    dataIndex: 'total',
    key: 'total',
    filter: 'agTextColumnFilter',
    isCustCellRender: true,
    cellRenderer: HelperFunction.renderCellAmt,
    sorter: (a, b) => HelperFunction.sortTableColumn(a, b, 'total', 'number'),
  },
  {
    title: 'Status',
    dataIndex: 'payment_status',
    key: 'payment_status',
    filter: 'agTextColumnFilter',

    sorter: (a, b) => a.payment_status.localeCompare(b.payment_status),
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    className: 'actionCol',
    cellRenderer: params => {
      const dt = params?.data
      const poNumber = dt && dt.invoice_no
      // console.log(text, record)
      return (
        <Link to={`/purchase/invoice/${poNumber}`}>
          <span className="viewIcon">
            <EyeOutlined />
          </span>
        </Link>
      )
    },
  },
]

const PurchaseInvoiceList = routerData => {
  const location = useLocation()
  console.log('location', location) 
  // console.log(CSVFILE, 'process.env.PUBLIC_URL', process.env.PUBLIC_URL)
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [page, setpage] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  const [baseData, setBaseData] = useState([])
  const [gridApi, setGridApi] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const org = store.get('selectedOrg')
      const result = await PurchaseService.purchaseInvoiceListNew(org)
      // console.log(result, 'ress111')

      if (result && result.length) {
        const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
        if (result.length) {
          result.forEach((ele, i) => {
            ele.key = i + 1
          })
        }
        setCSVData(csvDataVal)
        getQuotations(result)
        setBaseData(result)
      } else {
        setCSVData([])
        getQuotations([])
      }
    }

    fetchData()
  }, [page])

  const handleBulkUpload = () => {
    // console.log('handleBulkUpload')
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  const propsData = {
    name: 'file',
    action: 'https://103.8.167.194:8090/isees/api/purchaseOrder/saveBulkFiles',
    headers: {
      // authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
        handleCancel(false)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  const onHandleChange = async (e, value, key) => {
    // console.log(e, value, key)
    // getPurchaseInvoiceDateWise
    const org = store.get('selectedOrg')
    let result

    if (key === 'date') {
      const query = `startDate=${value[0]}&endDate=${value[1]}&orgCode=${org.orgCode}`
      result = await PurchaseService.getPurchaseInvoiceDateWise(query)
    } else if (key === 'month') {
      const monthVal = value.split('-')
      const query = `month=${monthVal[1]}&year=${monthVal[0]}&orgCode=${org.orgCode}`
      result = await PurchaseService.getPurchaseInvoiceMonthWise(query)
    } else if (key === 'year') {
      const query = `year=${value}&orgCode=${org.orgCode}`
      result = await PurchaseService.getPurchaseInvoiceYearWise(query)
    } else {
      const query = `orgCode=${org.orgCode}`
      result = await PurchaseService.getPurchaseInvoiceAllData(query)
    }

    // console.log(result, 'onHandleChange')

    // fetchData();
  }

  // const handleRecieptModal = () => {
  //   setShownReciept(!isShownReciept)
  // }

  const onFinish = values => {
    // console.log(values, 'onFinish')
  }

  const onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  const search = value => {
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

  // console.log(routerData, 'router')
  const routeName = routerData.location.search
  // console.log(routerData, 'routeName', routeName.includes('datewise'))
  // const { accepted, sent, draft, invoiced, declined } = quotationList
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-4">
        <div>
          <Input.Search allowClear placeholder="Search by..." enterButton onSearch={search} />
        </div>
        <div className="text-start">
          {/* <Input.Search
            allowClear
            // style={{ width: '0%' }}
            defaultValue=""
            onChange={onHandleChange}
          /> */}
          <Form
            layout="horizontal"
            style={{ display: 'flex' }}
            // fields={defaultData}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            {routeName.includes('datewise') && (
              <Form.Item
                style={{ marginBottom: 0 }}
                className="datewisefilter"
                name="datewise"
                label="Select Date"
              >
                <RangePicker onChange={(e, val) => onHandleChange(e, val, 'date')} />
              </Form.Item>
            )}

            {routeName.includes('report=monthwise') && (
              <Form.Item
                style={{ marginBottom: 0 }}
                className="monthwisefilter"
                name="montwise"
                label="Select Month"
              >
                <DatePicker picker="month" onChange={(e, val) => onHandleChange(e, val, 'month')} />
              </Form.Item>
            )}
            {routeName.includes('report=yearwise') && (
              <Form.Item
                style={{ marginBottom: 0 }}
                className="yearwiseftilter"
                name="yearwise"
                label="Select Year"
              >
                <DatePicker picker="year" onChange={(e, val) => onHandleChange(e, val, 'year')} />
              </Form.Item>
            )}
            {/* <Button type="primary" className="text-center" htmlType="submit">
              <strong>Apply</strong>
            </Button> */}
          </Form>
        </div>
        <div className="text-end">
          <Button color="secondary" className="me-2 mb-2">
            <Dropdown
              trigger={["click"]}
              popupRender={ () => <ExportOptions
                  handleRecieptModal={() => setShownReciept(!isShownReciept)}
                  csvData={csvData}
                  apiData={quotations}
                  columns={tableColumns}
                  fileName="Purchase Invoice List"
                />
              }
              className="me-2 mb-2"
            >
              <a className="ant-dropdown-link">
                Export As <DownOutlined />
              </a>
            </Dropdown>
          </Button>
          {/* <Button
            color="secondary"
            outline
            className="me-2 mb-2"
            size="large"
            onClick={() => setShownReciept(!isShownReciept)}
          >
            <strong>Print</strong>
          </Button> */}
          {/* <Button
            type="primary"
            size="large"
            className="text-center w-10 mb-1"
            htmlType="submit"
            onClick={showModal}
          >
            <strong>Bulk Invoice</strong>
          </Button>{' '} */}
          &nbsp;
          <Button type="primary" size="medium" className="text-center w-10 mb-1" htmlType="submit">
            <Link to="/purchase/invoice/create" className="text-white">
              Create Purchase Invoice
            </Link>
          </Button>
        </div>
      </div>
      {/* <Table
        id="table__layout--css"
        rowKey="id"
        columns={tableColumns}
        dataSource={quotations}
        pagination
        showSorterTooltip={false}
      /> */}

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
        />
      </div>

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
      <OtherPrimaryReport
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={quotations || []}
        salesValue="Purchase Invoice Report"
        flag="InvoiceList"
        // dateValue={"dateValue"}
      />
      {/* <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={quotations || []}
        salesValue="Purchase Invoice Report"
        flag="Purchase Invoice List"
      /> */}
      {isModalVisible && (
        <Modal
          title="Bulk Upload"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Upload {...propsData}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          <div style={{ marginTop: '15px', textDecoration: 'underline' }}>
            <a href={CSVFILE} target="_blank" rel="noopener noreferrer">
              Sample File
            </a>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default connect()(WithRouter(PurchaseInvoiceList));