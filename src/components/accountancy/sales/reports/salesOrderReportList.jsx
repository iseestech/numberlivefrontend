import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Tabs, Input, Space, Form, Dropdown, DatePicker, Select } from 'antd'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import store from 'store'
import { Helmet } from 'react-helmet'
import moment from 'moment'

import { AgGridReact } from 'ag-grid-react'
import { connect } from 'react-redux'
import QuotationService from '@/services/sales'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import ReceiptReportListModal from '@/components/accountancy/common/receiptReportListModal'
import HelperFunction from '@/services/helper'
import queryString from 'query-string'
import Receivable from '../../JSON/Receivable'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '../aggrid/singleLevelColumn'
import tableData from './data.json'
import WithRouter from '@/WithRouter'
const { RangePicker } = DatePicker
const { TabPane } = Tabs
const { Option } = Select

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const tableColumns = [
  ...Receivable.salesOrderReport,
  // {
  //   title: '#',
  //   dataIndex: 'key',
  //   key: 'key',
  //   // render: (text, record, index) => index + 1,
  // },
  // {
  //   title: 'Order#',
  //   dataIndex: 'orderno',
  //   key: 'orderno',
  //   render: (text, record, index) => (
  //     <Link to={`/sales/order/${record.orderno}`}> {record.orderno}</Link>
  //   ),
  // },
  // {
  //   title: 'Customer',
  //   dataIndex: 'customername',
  //   key: 'customername',
  // },
  // {
  //   title: 'Date',
  //   dataIndex: 'estimateDate',
  //   key: 'estimateDate',
  //   render: (text, record) => {
  //     return HelperFunction.dateFormatted(record.estimateDate)
  //   },
  // },
  // {
  //   title: 'Expiry',
  //   dataIndex: 'expirydate',
  //   key: 'expirydate',
  //   render: (text, record) => {
  //     return HelperFunction.dateFormatted(record.expirydate)
  //   },
  // },
  // {
  //   title: 'Status',
  //   dataIndex: 'status',
  //   key: 'status',
  // },
  // {
  //   title: 'Amount',
  //   dataIndex: 'total',
  //   key: 'total',
  // },
  // {
]

const OrderList = routerData => {
  const { reportFlag } = routerData

  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [page, setpage] = useState(1)
  const [isShownReciept, setShownReciept] = useState(false)
  const [dateValue, setDateValue] = useState()
  const [total, setTotal] = useState(0)
  const [filterKey, setFilterKey] = useState(reportFlag ? 'datewise' : '')
  const [csvData, setCSVData] = useState([])
  const [gridApi, setGridApi] = useState()

  const [defaultData, setDefaultData] = useState([
    { name: 'datewise', value: [] },
    { name: 'monthwise', value: '' },
    { name: 'yearwise', value: '' },
  ])

  useEffect(() => {
    // setFilterKey(reportFlag ? 'datewise' : '')
    fetchData(page)
  }, [page])

  const fetchData = async () => {
    const quoteData = {
      accepted: [],
      sent: [],
      draft: [],
      approved: [],
      declined: [],
    }
    const org = store.get('selectedOrg')
    const result = await QuotationService.getSaleOrderAll(`orgCode=${org.orgCode}`)
    // console.log(result, 'ress111')
    if (result && result.length) {
      const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
      setCSVData(csvDataVal)
      result.forEach(item => {
        if (item.status === 'ACCEPTED') {
          quoteData.accepted.push(item)
        } else if (item.status === 'DECLINED') {
          quoteData.declined.push(item)
        } else if (item.status === 'SENT') {
          quoteData.sent.push(item)
        } else if (item.status === 'APPROVE') {
          quoteData.approved.push(item)
        } else {
          quoteData.draft.push(item)
        }
      })

      const totalVal =
        result && result.reduce((partialSum, { total: amount }) => partialSum + amount, 0)
      setTotal(totalVal)
      if (result.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getQuotations(result)
      getQuotationsList(quoteData)
    } else {
      getQuotations([])
      setCSVData([])
      getQuotationsList(quoteData)
    }
  }
  const onHandleChange = (e, value) => {
    // console.log(e.target.value, value)
  }
  const resetFilter = () => {
    setDefaultData([
      { name: 'datewise', value: [] },
      { name: 'monthwise', value: '' },
      { name: 'yearwise', value: '' },
    ])
    fetchData()
  }
  const sort = async value => {
    //  // console.log(value.monthwise.format('MM'), 'ss')
    // console.log(value, 'value')
    const org = store.get('selectedOrg')
    if (value.datewise) {
      // console.log(value.datewise[0], 'date')
      const st = value.datewise[0].format('MM/DD/YYYY')
      const et = value.datewise[1].format('MM/DD/YYYY')
      const result = await QuotationService.getSaleOrderDateWise(
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
      const totalVal =
        result && result.reduce((partialSum, { total: amount }) => partialSum + amount, 0)
      setTotal(totalVal)
    } else if (value.monthwise) {
      // console.log(value.monthwise, 'month')
      const mt = value.monthwise.format('MM')
      const yr = value.monthwise.format('YYYY')
      const result = await QuotationService.getSaleOrderMonthWise(
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
      const totalVal =
        result && result.reduce((partialSum, { total: amount }) => partialSum + amount, 0)
      setTotal(totalVal)
    } else if (value.yearwise) {
      // console.log(value.yearwise, 'month')
      const mt = value.monthwise.format('MM')
      const yr = value.yearwise.format('YYYY')
      const result = await QuotationService.getSaleOrderYearWise(
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
      const totalVal =
        result && result.reduce((partialSum, { total: amount }) => partialSum + amount, 0)
      setTotal(totalVal)
    }
  }

  const handleFilterChange = e => {
    // console.log('click', e)
    setFilterKey(e)
  }

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  // console.log(routerData, 'router')
  // const routeName = routerData.match.path.split('/')[2]
  const { accepted, sent, draft, approved, declined } = quotationList
  const params1 = queryString.parse(routerData.location.search)
  const org = JSON.parse(localStorage.getItem('selectedOrg'))

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
            {reportFlag && (
              <Form.Item
                style={{ marginBottom: 0 }}
                className="datewisefilter me-1"
                name="filterType"
                // label="Select Type"
                label={null}
              >
                <Select
                  defaultValue="datewise"
                  style={{ width: 120 }}
                  onChange={handleFilterChange}
                >
                  <Option value="datewise">Date Wise</Option>
                  <Option value="monthwise">Month Wise</Option>
                  <Option value="yearwise">Year Wise</Option>
                </Select>
              </Form.Item>
            )}

            {(filterKey === 'datewise' || params1.report === 'datewise') && (
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

            {(filterKey === 'monthwise' || params1.report === 'monthwise') && (
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
            {(filterKey === 'yearwise' || params1.report === 'yearwise') && (
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
            {(reportFlag || params1.report !== undefined) && (
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
        <div className="text-end">
          <Button color="secondary" className="me-2 mb-2">
            <Dropdown
              trigger={["click"]}
              popupRender={() =>  <ExportOptions
                  handleRecieptModal={() => setShownReciept(!isShownReciept)}
                  csvData={csvData}
                  apiData={quotations}
                  columns={tableColumns}
                  fileName="Sales Order List"
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
          {/* <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
            <strong>
              {' '}
              <Link
                to={`/sales/${routeName.substring(0, routeName.length - 1)}/create`}
                className="text-white"
              >
                Create {routeName}
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
          <strong>Sales Order Report</strong>
        </div>
        <div>{dateValue}</div>
      </section>

      <div className="row">
        <div className="col-md-12">
          <>
            {/* <Table
            rowKey="id"
            columns={tableColumns}
            dataSource={quotations}
            pagination
            showSorterTooltip={false}
            summary={pageData => {
              const totalAmt = pageData.reduce((sum, record) => sum + record.total, 0)
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
                      <span>{totalAmt}</span>
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
              <div className="col-md-4 text-end">
                <strong>Total :</strong>
              </div>
              <div className="col-md-2">&nbsp;</div>
              <div className="col-md-5 text-center">
                <strong>{total} /-</strong>
              </div>
            </div>
          </div> 
        </div> */}
      </div>
      {/* <Tabs defaultActiveKey="1">
        <TabPane tab="All" key="1">
          <Table rowKey="id" columns={tableColumns} dataSource={quotations}  pagination
            showSorterTooltip={false} />
        </TabPane>
        <TabPane tab={`Draft (${draft && draft.length})`} key="2">
          <Table rowKey="id" columns={tableColumns} dataSource={draft}  pagination
            showSorterTooltip={false} />
        </TabPane>
        <TabPane tab={`Sent (${sent && sent.length})`} key="3">
          <Table rowKey="id" columns={tableColumns} dataSource={sent}  pagination
            showSorterTooltip={false} />
        </TabPane>
        <TabPane tab={`Declined (${declined && declined.length})`} key="4">
          <Table rowKey="id" columns={tableColumns} dataSource={declined}  pagination
            showSorterTooltip={false} />
        </TabPane>
        <TabPane tab={`Accepted (${accepted && accepted.length})`} key="5">
          <Table rowKey="id" columns={tableColumns} dataSource={accepted}  pagination
            showSorterTooltip={false} />
        </TabPane>
        <TabPane tab={`Approved (${approved && approved.length})`} key="6">
          <Table rowKey="id" columns={tableColumns} dataSource={approved}  pagination
            showSorterTooltip={false} />
        </TabPane>
      </Tabs> */}
      <OtherPrimaryReport
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={quotations || []}
        detailsInfo={{}}
        salesValue="Sales Order Report"
        dateValue={dateValue || ''}
        flag="SalesOrderList"
      />
      {/* <ReceiptReportListModal
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={quotations || []}
        salesValue="Sales Order"
        flag="Sales List"
        dateValue={dateValue}
      /> */}
    </div>
  )
}

export default connect()(WithRouter(OrderList))

