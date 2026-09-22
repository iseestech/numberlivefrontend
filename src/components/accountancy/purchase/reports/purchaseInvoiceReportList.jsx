import React, { useState, useEffect, useCallback } from 'react'
import {
  Button,
  Table,
  Tabs,
  Modal,
  Upload,
  Space,
  Dropdown,
  Form,
  message,
  Input,
  DatePicker,
} from 'antd'
import { DownOutlined, UploadOutlined, UnderlineOutlined } from '@ant-design/icons'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PurchaseService from '@/services/purchase'
import HelperFunction from '@/services/helper'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import ReceiptReportListModal from '@/components/accountancy/common/receiptReportListModal'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import store from 'store'
import moment from 'moment'
import tableData from './data.json'
import WithRouter from '@/WithRouter'
// import CSVFILE from './sample.csv'

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
    // sorter: (a, b) => a.total.localeCompare(b.total),
    sorter: (a, b) => HelperFunction.sortTableColumn(a, b, 'total', 'number'),
  },
  // {
  //   title: 'Status',
  //   dataIndex: 'payment_status',
  //   key: 'payment_status',
  // },
  // {
  //   title: 'Actions',
  //   dataIndex: 'actions',
  //   key: 'actions',
  //   render: (text, record) => {
  //     // console.log(text, record)
  //     return <Link to={`/purchase/invoice/${record.invoice_no}`}>click here</Link>
  //   },
  // },
]

const PurchaseInvoiceList = routerData => {
  //   // console.log(CSVFILE, 'process.env.PUBLIC_URL', process.env.PUBLIC_URL)
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [total, setTotal] = useState(0)
  const [page, setpage] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  const [dateValue, setDateValue] = useState()
  const [csvData, setCSVData] = useState([])
  const [defaultData, setDefaultData] = useState([
    { name: 'datewise', value: [] },
    { name: 'monthwise', value: '' },
    { name: 'yearwise', value: '' },
  ])
  const [gridApi, setGridApi] = useState()

  useEffect(() => {
    fetchData()
  }, [page])

  const handleBulkUpload = () => {
    // console.log('handleBulkUpload')
  }

  const fetchData = async () => {
    const org = store.get('selectedOrg')
    const result = await PurchaseService.purchaseInvoiceListNew(org)
    // console.log(result, 'ress111')
    if (result && result.length) {
      const totalVal = result.reduce((partialSum, { total: amount }) => partialSum + amount, 0)
      const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
      setCSVData(csvDataVal)
      // console.log('total', totalVal)
      if (result.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getQuotations(result)
      setTotal(totalVal)
      // getQuotationsList(quoteData)
    } else {
      getQuotations([])
      setCSVData([])
      // getQuotationsList(quoteData)
    }
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

  const onFinish = async value => {
    // console.log(values, 'onFinish')

    //  // console.log(value.monthwise.format('MM'), 'ss')

    const org = store.get('selectedOrg')
    if (value.datewise) {
      // console.log(value.datewise[0], 'date')
      const st = value.datewise[0].format('MM/DD/YYYY')
      const et = value.datewise[1].format('MM/DD/YYYY')
      const result = await PurchaseService.getPurchaseInvoiceDateWise(
        `startDate=${st}&endDate=${et}&orgCode=${org.orgCode}`,
      )
      const startDay = moment(value.datewise[0]).format('DD MMM YYYY')
      const endDay = moment(value.datewise[1]).format('DD MMM YYYY')
      setDateValue(`from ${startDay} to ${endDay}`)
      if (result.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getQuotations(result)
      const totalVal = result.reduce((partialSum, { total: amount }) => partialSum + amount, 0)
      // console.log('total', totalVal)
    } else if (value.monthwise) {
      // console.log(value.monthwise, 'month')
      const mt = value.monthwise.format('MM')
      const yr = value.monthwise.format('YYYY')
      const result = await PurchaseService.getPurchaseInvoiceMonthWise(
        `year=${yr}&month=${mt}&orgCode=${org.orgCode}`,
      )
      const startDay = moment(value.monthwise)
        .startOf('month')
        .format('DD MMM YYYY')
      const endDay = moment(value.monthwise)
        .endOf('month')
        .format('DD MMM YYYY')
      setDateValue(`from ${startDay} to ${endDay}`)
      if (result.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getQuotations(result)
      const totalVal = result.reduce((partialSum, { total: amount }) => partialSum + amount, 0)
      // console.log('total', totalVal)
    } else if (value.yearwise) {
      // console.log(value.yearwise, 'yearwise')
      // const mt = value.monthwise.format('MM')
      const yr = value.yearwise.format('YYYY')
      const result = await PurchaseService.getPurchaseInvoiceYearWise(
        `year=${yr}&orgCode=${org.orgCode}`,
      )
      const startDay = moment(value.yearwise)
        .startOf('year')
        .format('DD MMM YYYY')
      const endDay = moment(value.yearwise)
        .endOf('year')
        .format('DD MMM YYYY')
      setDateValue(`from ${startDay} to ${endDay}`)
      if (result.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getQuotations(result)
      const totalVal = result.reduce((partialSum, { total: amount }) => partialSum + amount, 0)
      // console.log('total', totalVal)
    } else {
      const result = await PurchaseService.purchaseInvoiceListNew(org)
      setDateValue('')
      if (result.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getQuotations(result)
    }
  }

  const onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  const resetFilter = () => {
    setDefaultData([
      { name: 'datewise', value: [] },
      { name: 'monthwise', value: '' },
      { name: 'yearwise', value: '' },
    ])
    setDateValue()
    fetchData()
  }

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  // console.log(routerData, 'router')
  const routeName = routerData.location.search
  // console.log(routerData, 'routeName', routeName.includes('datewise'))
  // const { accepted, sent, draft, invoiced, declined } = quotationList
  const org = JSON.parse(localStorage.getItem('selectedOrg'))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
            fields={defaultData}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            {routeName.includes('datewise') && (
              <Form.Item
                style={{ marginBottom: 0 }}
                className="datewisefilter me-1"
                name="datewise"
                label="Select Date"
                rules={[
                  {
                    required: true,
                    message: 'Please Select Date!',
                  },
                ]}
              >
                <RangePicker />
              </Form.Item>
            )}

            {routeName.includes('report=monthwise') && (
              <Form.Item
                style={{ marginBottom: 0 }}
                className="monthwisefilter me-1"
                name="monthwise"
                label="Select Month"
                rules={[
                  {
                    required: true,
                    message: 'Please Select Month!',
                  },
                ]}
              >
                <DatePicker
                  picker="month"
                  // onChange={(e, val) => onHandleChange(e, val, 'month')}
                />
              </Form.Item>
            )}
            {routeName.includes('report=yearwise') && (
              <Form.Item
                style={{ marginBottom: 0 }}
                className="yearwiseftilter me-1"
                name="yearwise"
                label="Select Year"
                rules={[
                  {
                    required: true,
                    message: 'Please Select Year!',
                  },
                ]}
              >
                <DatePicker
                  picker="year"
                  // onChange={(e, val) => onHandleChange(e, val, 'year')}
                />
              </Form.Item>
            )}
            <Button type="primary" className="text-center me-1" htmlType="submit">
              <strong>Apply</strong>
            </Button>
            <Button type="default" className="text-center" onClick={resetFilter}>
              {/* <ReloadOutlined /> */}
              Reset
            </Button>
          </Form>
        </div>
        <div className="text-end">
          <Button color="secondary" className="me-2 mb-2">
            <Dropdown
              trigger={["click"]}
              popupRender={() => <ExportOptions
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
          {/* <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
            <strong>
              {' '}
              <Link to="/purchase/invoice/create" className="text-white">
                Create Purchase Invoice
              </Link>
            </strong>
          </Button> */}
        </div>
      </div>
      <section
        className="midsection"
        style={{ textAlign: 'center', padding: '30px 0 45px 0', borderTop: '1px solid #ccc' }}
      >
        <div style={{ fontSize: '18px' }}>{org.orgName}</div>
        <div style={{ fontSize: '26px' }}>
          <strong>Purchase Invoice Report</strong>
        </div>
        <div>{dateValue}</div>
      </section>

      <div className="row">
        <div className="col-md-12">
          {/* <Table
            rowKey="id"
            columns={tableColumns}
            dataSource={quotations}
            pagination
            showSorterTooltip={false}
            summary={pageData => {
              const totalRepayment = pageData.reduce((sum, record) => sum + record.total, 0)
              return (
                <>
                  <Table.Summary.Row
                    className="ant-table-footer"
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    <Table.Summary.Cell>Total</Table.Summary.Cell>
                    <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                    <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                    <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                    <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <span>{totalRepayment}</span>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              )
            }}
          /> */}
          <div className="ag-theme-alpine agggrid--table__container">
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
        </div>
        {/* <div className="col-md-12">&nbsp;</div> */}
        {/* <div className="col-md-8">&nbsp;</div>
        <div className="col-md-4">
          <div style={{ border: '0px dashed', padding: '10px 0' }}>
            <div className="row">
              <div className="col-md-3 text-end">
                <strong>Total :</strong>
              </div>
              <div className="col-md-2">&nbsp;</div>
              <div className="col-md-5 text-start">
                <strong>{total} /-</strong>
              </div>
            </div>
          </div> 
        </div> */}
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
        dateValue={dateValue || ''}
        detailsInfo={{}}
        salesValue="Purchase Invoice Report"
        flag="PurchaseInvoiceListReport"
      />
      {/* <ReceiptReportListModal
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={quotations || []}
        salesValue="Purchase Invoice Report"
        flag="Purchase Invoice List"
        dateValue={dateValue}
      /> */}
      {/* {isModalVisible && (
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
      )} */}
    </div>
  )
}

export default connect()(WithRouter(PurchaseInvoiceList))
