import React, { Component, useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Tabs,
  Select,
  Divider,
  Modal,
  DatePicker,
  notification,
  Dropdown,
} from 'antd'
import moment from 'moment'
import { DownOutlined } from '@ant-design/icons'
import BankingCols from '@/components/accountancy/JSON/Banking'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import BankService from '@/services/banking'
import HelperFunction from '@/services/helper'
import store from 'store'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import ReportPdfContainer from '@/components/accountancy/common/pdf/reportsPdf'

const { TabPane } = Tabs

const tableColumns = [...BankingCols.bankReconciliation]

const Reconciliation = props => {
  const [matchedData, setMatchedData] = useState([])
  const [unMatchedData, setunMatchedData] = useState([])
  const [activeKey, setActiveKey] = useState('matchedData')
  const [bankAccList, setBankAccList] = useState([])
  const [accId, setAccId] = useState()
  const [isShownReciept, setShownReciept] = useState(false)
  const [gridApi, setGridApi] = useState()

  const [reportData, setReportData] = useState({
    csvData: [],
    apiData: [],
    columns: [],
    fileName: '',
    dateVal: [],
    footerRowData: [],
    flag: '',
  })

  const unMatchedColumns = [
    //   {
    //     title: '#',
    //     dataIndex: 'key',
    //     key: 'key',
    //     render: (text, record, index) => index + 1,
    //   },
    {
      title: 'DATE',
      dataIndex: 'date',
      key: 'date',
      render: (key, item) => HelperFunction.dateFormatted(item.date),
    },
    // {
    //   title: 'REFERENCE#',
    //   dataIndex: 'actname',
    //   key: 'actname',
    //   //   sorter: (a, b) => a.actname.localeCompare(b.actname),
    // },
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'type',
      //   sorter: (a, b) => a.subgroup.localeCompare(b.subgroup),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'DEPOSITS',
      dataIndex: 'deposits',
      key: 'deposits',
      //   sorter: (a, b) => a.subgroup.localeCompare(b.subgroup),
    },
    {
      title: 'WITHDRAWALS',
      dataIndex: 'withdrawals',
      key: 'withdrawals',
      //   sorter: (a, b) => a.subgroup.localeCompare(b.subgroup),
    },
    {
      title: 'BANK DATE',
      dataIndex: 'bank_date',
      key: 'bank_date',
      //   sorter: (a, b) => a.subgroup.localeCompare(b.subgroup),
      render: (key, item) => {
        return (
          <DatePicker
            // onChange={this.handleStDate}
            // defaultValue={moment('01/01/2021', 'DD/MM/YYYY')}
            id="dateInput"
            format="DD MMM YYYY"
            onBlur={e => handleDate(e, item)}
            // value={moment(purchaseDate, 'DD/MM/YYYY')}
          />
        )
      },
    },
  ]

  const handleDate = async (e, item) => {
    // console.log(e.target.value, item)
    const obj = {
      transactionId: item.transaction_id,
      bankDate: moment(document.getElementById('dateInput').value).format('MM/DD/YYYY'),
      type: item.type,
    }
    const result = await BankService.bankReconcile(obj)
    notification.success({
      message: 'Success',
      description: result.message || 'Successfully Updated!!!',
      duration: 6,
    })
    fetchData(props.accountId, activeKey)
    // console.log(result, 'ress111')
  }

  const callback = key => {
    // console.log('Key', key)
    setActiveKey(key)
    fetchData(accId, key)
  }

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  const fetchData = async (actId, key) => {
    const org = store.get('selectedOrg')
    // const { match } = this.props
    let isTrue
    if (key === 'matchedData') {
      isTrue = true
    } else if (key === 'unMatchedData') {
      isTrue = false
    }
    const result = await BankService.transactionMatchedList(org.orgCode, actId, isTrue)
    // console.log(result, 'ress111')
    if (key === 'matchedData') {
      setMatchedData(result || [])
      const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
      setReportData({
        csvData: csvDataVal || [],
        apiData: result || [],
        columns: tableColumns || [],
        fileName: 'Reconciliation Status' || '',
        // dateValue: dateValue || [],
        salesValue: 'Reconciliation Status' || '',
        flag: 'reconciliationStatusM' || '',
        // footerRowData: footerRowData || [],
      })
    } else if (key === 'unMatchedData') {
      setunMatchedData(result || [])
      const csvDataVal = HelperFunction.getDataForCSV(result, unMatchedColumns)
      setReportData({
        csvData: csvDataVal || [],
        apiData: result || [],
        columns: unMatchedColumns || [],
        fileName: 'Reconciliation Status' || '',
        // dateValue: dateValue || [],
        salesValue: 'Reconciliation Status' || '',
        flag: 'reconciliationStatusUM' || '',
        // footerRowData: footerRowData || [],
      })
    }
    // this.setState({
    //   transactionData: result || {},
    // })
  }

  // useEffect(() => {
  //   fetchData(props.accountId, activeKey)
  // }, [ props.accountId ])

  useEffect(() => {
    // console.log('working')
    const getBankData = async () => {
      const org = store.get('selectedOrg')
      const result = await BankService.bankList(org.orgCode, true)
      // console.log('result fetchData', result)
      setBankAccList(result || [])
    }
    getBankData()
  }, [])

  const onFinish = values => {
    // console.log(values, 'values')
    fetchData(values.paymentAct, activeKey)

    // fetchData(values.paymentAct)
    // setAccId(values.paymentAct)
    // setDateValue(values.datewise);
  }

  const handleAccChange = val => {
    // console.log(val, 'val')
    setAccId(val)
  }

  const resetFilter = () => {
    // setDefaultData([
    //   { name: 'datewise', value: [moment().add(-1, 'year'), moment(new Date(), dateFormat)] },
    // ])
    // setDateValue([
    //   moment()
    //     .add(-1, 'year')
    //     .format('DD MMM YYYY'),
    //   moment().format('DD MMM YYYY'),
    // ])
  }

  return (
    <div>
      <div className="top__section mb-3">
        <div className="row">
          <div className="col-sm-8">
            <Form
              layout="horizontal"
              // fields={defaultData}
              style={{ display: 'flex' }}
              // fields={defaultData}
              onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
            >
              <Form.Item
                style={{ marginBottom: 0 }}
                className="datewisefilter me-1"
                name="paymentAct"
                label="Select Account"
                rules={[
                  {
                    required: true,
                    message: 'Please Select Account',
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
                  {bankAccList.map(x => {
                    return (
                      <Select.Option key={x.id} value={x.accountid}>
                        {x.actname}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
              <>
                <Button type="primary" className="text-center me-1" htmlType="submit">
                  <strong>Apply</strong>
                </Button>
                {/* <Button type="default" className="text-center" onClick={resetFilter}>
              Reset
            </Button> */}
              </>
            </Form>
          </div>
          <div className="col-sm-4 text-end">
            <div>
              <Button type="default" className="me-2">
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
              <Button type="primary" size="medium" className="text-center" htmlType="submit">
                <Link to="/banking/reconciliation/create" className="text-white">
                  Create Reconciliation
                </Link>
              </Button>
            </div>
          </div>
        </div>
        {/* <hr style={{ margin: '0' }} /> */}
        {/* <div className="page-header text-center pb-2"> */}
        {/* <h4>Test</h4>  */}
        {/* <h3 className="reports-headerspacing"> Reconciliation Status </h3> */}
        {/* <span>Basis: Accrual</span> */}
        {/* <h5>
            <span>From</span>&nbsp;01 May 2021 <span>To</span>&nbsp;31 May 2021
          </h5> */}
        {/* <div className="tags"> </div>
        </div> */}
      </div>
      {/* <Tabs defaultActiveKey={activeKey} onChange={callback}> */}
      {/* <TabPane tab="InProgress - Reconciliation Summary" key="1">
          <table
            style={{ width: '60%', margin: '0 auto' }}
            className="table tb-comparison-table zi-table financial-comparison table-no-border"
          >
            <thead>
              <tr>
                <th id="ember1303" className="sortable text-start ember-view">
                  <div className="position-relative ">
                    <div className="text-center over-flow" title="Account">
                      Summary
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="rep-subttl">
                <td>
                  <b>Opening Balance</b>
                  <span className="float-right">0.00</span>
                </td>
              </tr>
              <tr className="rep-subttl">
                <td>
                  <b>Closing Balance</b>
                  <span className="float-right">0.00</span>
                </td>
              </tr>
              <tr className="rep-subttl">
                <td>
                  <b>Total value of matched transactions for the period</b>
                  <span className="float-right">0.00</span>
                </td>
              </tr>
              <tr className="rep-subttl">
                <td>
                  <b>Total value of unmatched statements as on 30/11/2021</b>
                  <span className="float-right">0.00</span>
                </td>
              </tr>
              <tr className="rep-subttl">
                <td>
                  <b>Total value of unmatched transactions as on 30/11/2021</b>
                  <span className="float-right">0.00</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* <Table rowKey="id" columns={tableColumns} dataSource={quotations} pagination={false} /> */}
      {/*  <Table
            rowKey="id"
            columns={tableAllColumns}
            dataSource={ALL || []}
            pagination
            showSorterTooltip={false}
          /> 
        </TabPane> */}
      {/* <TabPane tab="Matched Transaction" key="matchedData"> */}
      {/* <Table
        id="table__layout--css"
        rowKey="id"
        columns={tableColumns}
        dataSource={matchedData || []}
        pagination
        showSorterTooltip={false}
      /> */}

      <div className="ag-theme-alpine agggrid--table__container">
        <AgGridReact
          theme={"legacy"}
          rowData={matchedData}
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

      {/* </TabPane> */}
      {/* <TabPane tab="Un-Matched Transaction" key="unMatchedData">
          <Table
            rowKey="id"
            columns={unMatchedColumns}
            dataSource={unMatchedData || []}
            pagination
            showSorterTooltip={false}
          />
        </TabPane> */}
      {/* </Tabs> */}

      <ReportPdfContainer
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={reportData.apiData.length ? [...reportData.apiData] : []}
        salesValue={reportData.salesValue || ''}
        flag={reportData.flag || ''}
        dateValue={reportData.dateValue || ''}
        footerRowData={reportData.footerRowData || []}
      />
    </div>
  )
}
const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(Reconciliation)

