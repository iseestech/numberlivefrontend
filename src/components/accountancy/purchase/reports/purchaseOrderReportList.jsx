import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Tabs, Input, Space, Dropdown, Form, DatePicker } from 'antd'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import { DownOutlined, ReloadOutlined } from '@ant-design/icons'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import { Helmet } from 'react-helmet'
import store from 'store'
import { connect } from 'react-redux'
import PurchaseService from '@/services/purchase'
import HelperFunction from '@/services/helper'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import ReceiptReportListModal from '@/components/accountancy/common/receiptReportListModal'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import moment from 'moment'
import tableData from './data.json'
import './index.scss'
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
    filter: 'agTextColumnFilter',

    // render: (text, record, index) => index + 1,
  },
  {
    title: 'Purchase No#',
    dataIndex: 'purchase_order_no',
    key: 'purchase_order_no',
    filter: 'agTextColumnFilter',

    sorter: (a, b) => a.purchase_order_no.localeCompare(b.purchase_order_no),
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
    filter: 'agTextColumnFilter',

    sorter: (a, b) => a.vendorName.localeCompare(b.vendorName),

    // render: (text, record) => {
    //   return (
    //     <Link to={`/purchase/order/${record.id}`}>{`${record.firstName} ${record.lastName}`}</Link>
    //   )
    // },
  },
  {
    title: 'Order Date',
    dataIndex: 'podate',
    key: 'podate',
    filter: 'agTextColumnFilter',

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
    filter: 'agTextColumnFilter',
    isCustCellRender: true,
    cellRenderer: HelperFunction.renderCellAmt,
    // sorter: (a, b) => a.amount.localeCompare(b.amount),
    sorter: (a, b) => HelperFunction.sortTableColumn(a, b, 'amount', 'number'),
    footer: {
      render: data => {
        return <div>Summary: {data.reduce((sum, record) => sum + record.amount, 0)}</div>
      },
      position: 'top', // default to 'bottom', could be 'top'
    },
  },
  // {
  //   title: 'Status',
  //   dataIndex: 'accept_status',
  //   key: 'accept_status',
  // },
  // {
  //   title: 'Actions',
  //   dataIndex: 'actions',
  //   key: 'actions',
  //   render: (text, record) => {
  //     // console.log(text, record)
  //     return <Link to={`/purchase/order/${record.purchase_order_no}`}>click here</Link>
  //   },
  // },
]

const PurchaseOrderList = routerData => {
  const [quotations, getQuotations] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setpage] = useState(1)
  const [reportType, setReportType] = useState('default')
  const [isShownReciept, setShownReciept] = useState(false)
  const [quotationList, getQuotationsList] = useState({})
  const [dateValue, setDateValue] = useState('')
  const [defaultData, setDefaultData] = useState([
    { name: 'datewise', value: [] },
    { name: 'monthwise', value: '' },
    { name: 'yearwise', value: '' },
  ])
  const [gridApi, setGridApi] = useState()
  const [csvData, setCSVData] = useState([])

  //
  // const [page, setpage] = useState(1)
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    const org = store.get('selectedOrg')
    const result = await PurchaseService.purchaseOrderListNew(org)
    const params1 = queryString.parse(routerData.location.search)

    if (result && result.length) {
      const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
      const totalVal = result.reduce((partialSum, { amount }) => partialSum + amount, 0)
      if (result.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setTotal(totalVal)
      getQuotations(result)
      setCSVData(csvDataVal)
    } else {
      getQuotations([])
      setCSVData([])
      setTotal(0)
    }
  }

  const onHandleChange = (e, val) => {
    // console.log(e, val)
  }
  const handleRecieptModal = () => {
    setShownReciept(!isShownReciept)
  }
  const sort = async value => {
    //  // console.log(value.monthwise.format('MM'), 'ss')
    // console.log(value, 'value')
    const org = store.get('selectedOrg')
    if (value.datewise) {
      // console.log(value.datewise[0], 'date')
      const st = value.datewise[0].format('MM/DD/YYYY')
      const et = value.datewise[1].format('MM/DD/YYYY')
      const result = await PurchaseService.getPurchaseOrderDateWise(
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
      const totalVal = result.reduce((partialSum, { amount }) => partialSum + amount, 0)
      setTotal(totalVal)
    } else if (value.monthwise) {
      // console.log(value.monthwise, 'month')
      const mt = value.monthwise.format('MM')
      const yr = value.monthwise.format('YYYY')
      const result = await PurchaseService.getPurchaseOrderMonthWise(
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
      const totalVal = result.reduce((partialSum, { amount }) => partialSum + amount, 0)
      setTotal(totalVal)
    } else if (value.yearwise) {
      // console.log(value.yearwise, 'month')
      // const mt = value.monthwise.format('MM')
      const yr = value.yearwise.format('YYYY')
      const result = await PurchaseService.getPurchaseOrderYearWise(
        `Year=${yr}&orgCode=${org.orgCode}`,
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
      const totalVal = result.reduce((partialSum, { amount }) => partialSum + amount, 0)
      setTotal(totalVal)
    }
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

  // console.log('reportType', reportType)
  // console.log(routerData, 'router')
  // const routeName = routerData.match.path.split('/')[2]
  const { accepted, sent, draft, invoiced, declined } = quotationList
  const params1 = queryString.parse(routerData.location.search)
  const routeName1 = routerData.location.search
  const org = JSON.parse(localStorage.getItem('selectedOrg'))

  // console.log('dateValue', dateValue)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="text-start">
          <Form
            layout="horizontal"
            fields={defaultData}
            style={{ display: 'flex' }}
            // fields={defaultData}
            onFinish={sort}
            // onFinishFailed={onFinishFailed}
          >
            {params1.report === 'datewise' && (
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
                <RangePicker onChange={(e, val) => onHandleChange(e, val, 'date')} />
              </Form.Item>
            )}

            {params1.report === 'monthwise' && (
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
                <DatePicker picker="month" onChange={(e, val) => onHandleChange(e, val, 'month')} />
              </Form.Item>
            )}
            {params1.report === 'yearwise' && (
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
                <DatePicker picker="year" onChange={(e, val) => onHandleChange(e, val, 'year')} />
              </Form.Item>
            )}
            {params1.report !== undefined && (
              <>
                <Button type="primary" className="text-center me-1" htmlType="submit">
                  <strong>Apply</strong>
                </Button>
                <Button type="default" className="text-center" onClick={resetFilter}>
                  {/* <ReloadOutlined /> */}
                  Reset
                </Button>
              </>
            )}
          </Form>
        </div>
        {/* </div> */}
        <div className="text-end">
          <Button color="secondary" className="me-2 mb-2">
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
          {/* <Button
            color="secondary"
            // outline
            className="me-2 mb-2"
            size="large"
            onClick={handleRecieptModal}
          >
            <strong>Print</strong>
          </Button> */}
          {/* <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
            <strong>
              {' '}
              <Link
                to={`/purchase/${routeName.substring(0, routeName.length - 1)}/create`}
                className="text-white"
              >
                Create {routeName}
              </Link>
            </strong>
          </Button> */}
        </div>
      </div>
      {/* <Form> */}
      {/* <div className="row"> */}
      <section
        className="midsection"
        style={{ textAlign: 'center', padding: '30px 0 45px 0', borderTop: '1px solid #ccc' }}
      >
        <div style={{ fontSize: '18px' }}>{org.orgName}</div>
        <div style={{ fontSize: '26px' }}>
          <strong>Purchase Order Report</strong>
        </div>
        <div>{dateValue}</div>
      </section>

      <div className="row">
        <div className="col-md-12">
          <>
            {/* 
          <Table
            // className="purchaseOrderList"
            rowKey="id"
            columns={tableColumns}
            dataSource={quotations}
            pagination
            showSorterTooltip={false}
            // pagination={false}
            // scroll={{ x: '100%', y: 500 }}
            // footer={dataVal => {
            //   return (
            //     <div
            //       style={{
            //         display: 'flex',
            //         justifyContent: 'space-between',
            //         marginRight: '10%',
            //         fontWeight: 'bold',
            //       }}
            //     >
            //       <span>Total</span>{' '}
            //       <span>{dataVal.reduce((sum, record) => sum + record.amount, 0)} </span>
            //     </div>
            //   )
            // }}
            summary={pageData => {
              const totalRepayment = pageData.reduce((sum, record) => sum + record.amount, 0)
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
          </>
        </div>
        {/* <div className="col-md-12">&nbsp;</div> */}
        {/* <div className="col-md-8">&nbsp;</div>
        <div className="col-md-4">
          <div style={{ border: '0px dashed', padding: '10px 0' }}>
            <div className="row">
              <div className="col-md-3 text-end">
                <strong>Total :</strong>
              </div>
              <div className="col-md-3">&nbsp;</div>
              <div className="col-md-5 text-start">
                <strong>{total} /-</strong>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={handleRecieptModal}
        quoteData={quotations || []}
        salesValue="Purchase Order Report"
        flag="PurchaseOrderListReport"
      /> */}
      <OtherPrimaryReport
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={quotations || []}
        dateValue={dateValue || ''}
        detailsInfo={{}}
        salesValue="Purchase Order Report"
        flag="PurchaseOrderListReport"
      />
      {/* <ReceiptReportListModal
        visible={isShownReciept}
        handleRecieptModal={handleRecieptModal}
        quoteData={quotations || []}
        salesValue="Purchase Order Report"
        flag="Purchase Order List"
        dateValue={dateValue}
      /> */}
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
    </div>
  )
}

export default connect()(WithRouter(PurchaseOrderList))

