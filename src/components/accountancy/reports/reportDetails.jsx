import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Menu,
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Select,
  Divider,
  Modal,
  DatePicker,
  Dropdown,
} from 'antd'
import moment from 'moment'
import { DownOutlined } from '@ant-design/icons'
import StockList from '@/components/accountancy/inventory/stocks/stockList'
import QuotationList from '@/components/accountancy/sales/reports/salesQuoteReportList'
import OrderList from '@/components/accountancy/sales/reports/salesOrderReportList'
import BankService from '@/services/banking'
import store from 'store'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import InvoiceList from '@/components/accountancy/sales/reports/salesInvoiceReportList'
import HelperFunction from '@/services/helper'
import ChartOfAccService from '@/services/chartOfAccount'
import Reconciliation from './reportType/Reconciliation'
import ProfitAndLoss from './profitAndLoss'
import ReportHeader from './reportHeader'
import DatewiseInventory from './reportType/datewiseInventory'
import PurchaseReportDetails from './purchaseReport/index'
import ExpenseReportDetails from './purchaseReport/expensesReport'
import CustomerReportDetails from './customer/customerReport'
import VendorReportDetails from './vendor'
import SaleByCustomer from './saleByCustomer'
import OtherReportComp from './vendor/otherReportComp'
import BuisnessOverview from './buisnessOverview'
import CashFlowReport from './cashFlowReport'
import './index.scss'
import ReportPdfContainer from '../common/pdf/reportsPdf'
import WithRouter from "@/WithRouter";
const { Option } = Select
const { RangePicker } = DatePicker
const dateFormat = 'DD MMM YYYY'

const primaryActData = [
  'Branch/Divisions',
  'Capital Account',
  'Current Assets',
  'Current Liabilities',
  'Direct Expenses',
  'Direct Income',
  'Fixed Assets',
  'Indirect expenses',
  'Indirect Incomes',
  'investments',
  'Loans Liabilities',
  'Misc. Expenses',
  'Purchase Account',
  'Sale Account',
  'Suspense',
]

const ReportDetails = props => {
  const inputRef = useRef(null)
  // const inputRef = React.createRef()
  const { params, location } = props
  // const { params } = match
  const { state: stateData } = location
  const [bankAccList, setBankAccList] = useState([])
  const [accId, setAccId] = useState()
  const [dateValue, setDateValue] = useState([
    moment()
      .add(-1, 'year')
      .format('DD MMM YYYY'),
    moment().format('DD MMM YYYY'),
  ])

  // to handle PDF, XLS, CSV
  const [isShownReciept, setShownReciept] = useState(false)
  const [updateChildComp, setUpdateChildComp] = useState(null)
  const [chartOfAccounts, setChartOfAccount] = useState([])
  const [subGroupAct, setSubGroupAct] = useState([])
  const [bizOverviewFilter, setBizOverviewAccount] = useState({})

  const [reportData, setReportData] = useState({
    csvData: [],
    apiData: [],
    columns: [],
    fileName: '',
    dateVal: [],
    flag: '',
    info: {},
  })

  const [defaultData, setDefaultData] = useState([
    { name: 'datewise', value: [moment().add(-1, 'year'), moment(new Date(), dateFormat)] },
    { name: 'accId', value: '' },
  ])

  useEffect(() => {
    // console.log('working')
    const fetchData = async () => {
      const org = store.get('selectedOrg')
      const result = await BankService.bankList(org.orgCode, true)
      // console.log('result fetchData', result)
      setBankAccList(result || [])
    }
    fetchData()

    if (!params.reportId && params.report === 'Statement of Account') {
      chartOfAllAcount()
    }
    if (!params.reportId && params.report === 'Statement By Subgroup') {
      getAllSubGrpAct()
    }
    // if(!params.reportId && params.report === 'Statement By Primarygroup') {
    //   getAllPrimaryAct()
    // }
  }, [])

  const onHandleChange = e => {
    // console.log(e)
    if (e) {
      const startDay = moment(e[0]).format('DD MMM YYYY')
      const endDay = moment(e[1]).format('DD MMM YYYY')
      setDateValue([startDay, endDay])
    }
  }

  const resetFilter = () => {
    setDefaultData([
      { name: 'datewise', value: [moment().add(-1, 'year'), moment(new Date(), dateFormat)] },
    ])
    setDateValue([
      moment()
        .add(-1, 'year')
        .format('DD MMM YYYY'),
      moment().format('DD MMM YYYY'),
    ])
  }

  const onFinish = values => {
    // console.log(values, 'values')
    if (values.datewise) {
      const startDay = moment(values.datewise[0]).format('DD MMM YYYY')
      const endDay = moment(values.datewise[1]).format('DD MMM YYYY')
      // setDateValue(`from ${startDay} to ${endDay}`)
      if (
        params.report === 'Statement of Account' ||
        params.report === 'Statement By Subgroup' ||
        params.report === 'Statement By Primarygroup' ||
        params.report === 'Statement By Nature_Of_Account'
      ) {
        setBizOverviewAccount({
          startDay,
          endDay,
          accId: values.accId,
        })
      } else {
        setDateValue([startDay, endDay])
      }
    }
    if (params.report === 'reconciliation') {
      // fetchData(values.paymentAct)
      setAccId(values.paymentAct)
    }
    // setDateValue(values.datewise);
  }

  const fetchData = async actId => {
    const org = store.get('selectedOrg')
    // const { match } = this.props
    const result = await BankService.transactionMatchedList(org.orgCode, actId, false)
    // console.log(result, 'ress111')
    // this.setState({
    //   transactionData: result || {},
    // })
  }

  const handleAccChange = val => {
    // console.log(val, 'val')
    setAccId(val)
  }

  const handlePdfXlxCsv = val => {
    const { apiData = [], columns = [], fileName, salesValue, flag, info } = val
    // console.log(val, 'handlePdfXlxCsv val')
    const csvDataVal = HelperFunction.getDataForCSV(apiData, columns)
    // const pdfData = apiData || [];
    setReportData({
      csvData: csvDataVal || [],
      apiData: apiData || [],
      columns: columns || [],
      fileName: fileName || '',
      dateValue: dateValue || [],
      salesValue: salesValue || '',
      flag: flag || '',
      info: info || {},
    })
  }

  const chartOfAllAcount = async () => {
    const org = store.get('selectedOrg')
    const result = await ChartOfAccService.ChartOfAllAcount(org.orgCode)
    // console.log(result, 'ChartOfAllAcount')
    setChartOfAccount(result)
    if (stateData && stateData.startEndDate) {
      // const {startDay, endDay} = startEndDate;
      const { startEndDate, accId: id } = stateData
      setDefaultData([
        { name: 'datewise', value: [moment(startEndDate[0]), moment(startEndDate[1], dateFormat)] },
        { name: 'accId', value: id },
      ])

      setBizOverviewAccount({
        startDay: startEndDate[0],
        endDay: startEndDate[1],
        accId: id,
      })
    }
  }

  const getAllSubGrpAct = async () => {
    const org = store.get('selectedOrg')
    const result = await ChartOfAccService.accountSubGroup(org.orgCode)
    // console.log(result, 'getAllSubGrpAct')
    setSubGroupAct(result)
  }

  // console.log('params', params, reportData)
  return (
    <div id="report--details" className="details_layout--page">
      {/* <ReportHeader /> */}
      {params.report !== 'Inventory' &&
        params.report !== 'Sales Invoice Details' &&
        params.report !== 'Sales Order Details' &&
        params.report !== 'Sales Quote Details' &&
        params.report !== 'reconciliation' && (
          <div className="row">
            <div className="col-sm-10">
              {params.report !== 'Customer Balance' &&
                params.report !== 'Vendor Balance' &&
                params.report !== 'Vendor Balance Summary' && (
                  <Form
                    layout="horizontal"
                    fields={defaultData}
                    style={{ display: 'flex' }}
                    // fields={defaultData}
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                  >
                    {params.report !== 'reconciliation' && (
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        className="datewisefilter me-1"
                        name="datewise"
                        label="Select Date"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please Select Date!',
                        //   },
                        // ]}
                      >
                        <RangePicker
                          onChange={e => onHandleChange(e)}
                          // defaultValue={[moment().add(-1, 'year'), moment(new Date(), dateFormat)]}
                          format={dateFormat}
                        />
                      </Form.Item>
                    )}
                    {!params.reportId && params.report === 'reconciliation' && (
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        className="datewisefilter me-1"
                        name="paymentAct"
                        label="Select Account"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please Select Date!',
                        //   },
                        // ]}
                      >
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          defaultValue="1969"
                          style={{ width: '150px' }}
                          onChange={handleAccChange}
                        >
                          {bankAccList.map(x => {
                            return (
                              <Select.Option key={x.id} value={x.accountid}>
                                {x.actname}
                              </Select.Option>
                            )
                          })}
                        </Select>
                      </Form.Item>
                    )}
                    {!params.reportId && params.report === 'Statement of Account' && (
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        className="accountDropdown me-1"
                        name="accId"
                        label="Select Account"
                        rules={[
                          {
                            required: true,
                            message: 'Please Select Account!',
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          // value=""
                          style={{ width: '150px' }}
                          onChange={handleAccChange}
                        >
                          {chartOfAccounts.map(x => {
                            return (
                              <Select.Option key={x.id} value={x.id}>
                                {x.actName}
                              </Select.Option>
                            )
                          })}
                        </Select>
                      </Form.Item>
                    )}
                    {!params.reportId && params.report === 'Statement By Subgroup' && (
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        className="accountDropdown me-1"
                        name="accId"
                        label="Select Account"
                        rules={[
                          {
                            required: true,
                            message: 'Please Select Account!',
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          value=""
                          style={{ width: '150px' }}
                          onChange={handleAccChange}
                        >
                          {subGroupAct.map(x => {
                            return (
                              <Select.Option key={x.acccount_grp_id} value={x.acccount_grp_id}>
                                {x.sub_group}
                              </Select.Option>
                            )
                          })}
                        </Select>
                      </Form.Item>
                    )}
                    {!params.reportId && params.report === 'Statement By Primarygroup' && (
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        className="accountDropdown me-1"
                        name="accId"
                        label="Select Account"
                        rules={[
                          {
                            required: true,
                            message: 'Please Select Account!',
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          value=""
                          style={{ width: '150px' }}
                          onChange={handleAccChange}
                        >
                          {primaryActData.map(x => {
                            return (
                              <Select.Option key={x} value={x}>
                                {x}
                              </Select.Option>
                            )
                          })}
                        </Select>
                      </Form.Item>
                    )}
                    {!params.reportId && params.report === 'Statement By Nature_Of_Account' && (
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        className="accountDropdown me-1"
                        name="accId"
                        label="Select Account"
                        rules={[
                          {
                            required: true,
                            message: 'Please Select Account!',
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          value=""
                          style={{ width: '150px' }}
                          onChange={handleAccChange}
                        >
                          <Select.Option value="ASSETS">ASSETS</Select.Option>
                          <Select.Option value="EXPENSES">EXPENSES</Select.Option>
                          <Select.Option value="INCOME">INCOME</Select.Option>
                          <Select.Option value="LIABILITIES">LIABILITIES</Select.Option>
                        </Select>
                      </Form.Item>
                    )}

                    {params.report !== 'reconciliation' && (
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
                )}
            </div>
            {/* <div className="col-sm-5">&nbsp;</div> */}
            <div className="col-sm-2 text-end">
              <div>
                <Button color="secondary" className="me-2 mb-2">
                  <Dropdown
                    trigger={["click"]}
                    popupRender={() => <ExportOptions
                        handleRecieptModal={() => setShownReciept(!isShownReciept)}
                        csvData={reportData.csvData || []}
                        apiData={reportData.apiData || []}
                        columns={reportData.columns || []}
                        fileName={reportData.fileName || ''}
                        flag={reportData.flag || ''}
                      />
                    }
                    className="me-2 mb-2"
                  >
                    <a className="ant-dropdown-link">
                      Export As <DownOutlined />
                    </a>
                  </Dropdown>
                </Button>
              </div>
            </div>
          </div>
        )}

      {/* <hr /> */}
      {params.report === 'abc-report' && <ProfitAndLoss />}
      {!params.reportId &&
        (params.report === 'Sales By Customer' || params.report === 'Sales By Item') && (
          <>
            <SaleByCustomer
              reportName={params.report}
              dateValue={dateValue}
              callback={onFinish}
              reportId={params.reportId}
              // for PDF, CSV, XLS
              updateChildComp={updateChildComp}
              handlePdfXlxCsv={handlePdfXlxCsv}
            />
          </>
        )}
      {params.reportId && params.report === 'Sales By Customer' && (
        <SaleByCustomer
          // ref={childRef}
          reportName={params.report}
          dateValue={dateValue}
          callback={onFinish}
          reportId={params.reportId}
          handlePdfXlxCsv={handlePdfXlxCsv}
        />
      )}
      {!params.reportId && params.report === 'Inventory' && <StockList />}
      {!params.reportId && params.report === 'Sales Invoice Details' && <InvoiceList reportFlag />}
      {!params.reportId && params.report === 'Sales Order Details' && <OrderList reportFlag />}
      {!params.reportId && params.report === 'Sales Quote Details' && <QuotationList reportFlag />}

      {!params.reportId && params.report === 'reconciliation' && (
        <Reconciliation reportFlag accountId={accId} />
      )}
      {!params.reportId && params.report === 'Datewise Inventory' && (
        <DatewiseInventory
          reportName={params.report}
          dateValue={dateValue}
          callback={onFinish}
          reportId={params.reportId}
          handlePdfXlxCsv={handlePdfXlxCsv}
        />
      )}
      {!params.reportId &&
        (params.report === 'Purchase By Vendor' || params.report === 'Purchase By Item') && (
          <PurchaseReportDetails
            reportName={params.report}
            dateValue={dateValue}
            callback={onFinish}
            reportId={params.reportId}
            handlePdfXlxCsv={handlePdfXlxCsv}
          />
        )}
      {params.reportId &&
        (params.report === 'Purchase By Vendor' || params.report === 'Purchase By Item') && (
          <PurchaseReportDetails
            reportName={params.report}
            dateValue={dateValue}
            callback={onFinish}
            reportId={params.reportId}
            handlePdfXlxCsv={handlePdfXlxCsv}
          />
        )}
      {!params.reportId &&
        (params.report === 'Expense Details' || params.report === 'Expense by Category') && (
          <ExpenseReportDetails
            reportName={params.report}
            dateValue={dateValue}
            callback={onFinish}
            reportId={params.reportId}
            handlePdfXlxCsv={handlePdfXlxCsv}
          />
        )}
      {!params.reportId && params.report === 'Customer Balance' && (
        <CustomerReportDetails
          reportName={params.report}
          dateValue={dateValue}
          callback={onFinish}
          reportId={params.reportId}
          handlePdfXlxCsv={handlePdfXlxCsv}
        />
      )}
      {params.reportId && params.report === 'Customer Balance Details' && (
        <CustomerReportDetails
          reportName={params.report}
          dateValue={dateValue}
          callback={onFinish}
          reportId={params.reportId}
          handlePdfXlxCsv={handlePdfXlxCsv}
        />
      )}
      {!params.reportId &&
        (params.report === 'Vendor Balance' ||
          params.report === 'Bills Details' ||
          params.report === 'Vendor Balance Summary' ||
          params.report === 'Payment Made' ||
          params.report === 'Purchase Order Details' ||
          params.report === 'Receivable Summary' ||
          params.report === 'Vendor Credit Details') && (
          <VendorReportDetails
            reportName={params.report}
            dateValue={dateValue}
            callback={onFinish}
            reportId={params.reportId}
            handlePdfXlxCsv={handlePdfXlxCsv}
          />
        )}
      {!params.reportId &&
        (params.report === 'Purchase Order By Vendor' ||
          params.report === 'Payables Summary' ||
          params.report === 'Payments Received' ||
          params.report === 'Debit Notes' ||
          params.report === 'Credit Notes') && (
          <OtherReportComp
            reportName={params.report}
            dateValue={dateValue}
            callback={onFinish}
            reportId={params.reportId}
            handlePdfXlxCsv={handlePdfXlxCsv}
          />
        )}

      {(params.report === 'Statement of Account' ||
        params.report === 'Statement By Subgroup' ||
        params.report === 'Statement By Primarygroup' ||
        params.report === 'Statement By Nature_Of_Account' ||
        params.report === 'Statement By Date') && (
        <BuisnessOverview
          reportName={params.report}
          dateValue={dateValue}
          filter={bizOverviewFilter}
          callback={onFinish}
          reportId={params.reportId}
          handlePdfXlxCsv={handlePdfXlxCsv}
        />
      )}

      {params.report === 'Cash Flow Statement' && (
        <CashFlowReport
          reportName={params.report}
          dateValue={dateValue}
          filter={bizOverviewFilter}
          callback={onFinish}
          reportId={params.reportId}
          handlePdfXlxCsv={handlePdfXlxCsv}
        />
      )}

      {/* <OtherPrimaryReport
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={[...reportData.apiData] || []}
        salesValue={reportData.salesValue || ''}
        flag={reportData.flag || ''}
        dateValue={reportData.dateValue || ''}
      /> */}

      <ReportPdfContainer
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={reportData.apiData.length ? [...reportData.apiData] : []}
        salesValue={reportData.salesValue || ''}
        flag={reportData.flag || ''}
        dateValue={reportData.dateValue || ''}
        info={reportData.info || {}}
      />
    </div>
  )
}
const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(WithRouter(ReportDetails))

