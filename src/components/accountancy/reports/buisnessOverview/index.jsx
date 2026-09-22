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
import { AgGridReact } from 'ag-grid-react'
import ReportServices from '@/services/reports'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import HelperFunction from '@/services/helper'
import BuisnessOverviewCols from '@/components/accountancy/JSON/BuisnessOverview'
import moment from 'moment'
import '../index.scss'
import ReportPdfContainer from '../../common/pdf/reportsPdf'

const statementOfAccColNew = [...BuisnessOverviewCols.statementOfAccount]

const statementOfAccCol = [
  ...BuisnessOverviewCols.statementBySubGroup,
  // {
  //   title: '#',
  //   dataIndex: 'key',
  //   key: 'key',
  //   // render: (text, record, index) => index + 1,
  // },
  // {
  //   title: 'Act Name',
  //   name: 'act_name',
  //   dataIndex: 'act_name',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Date',
  //   dataIndex: 'date',
  //   name: 'date',
  //   responsive: ['xs', 'sm'],
  //   render: (text, record) => {
  //     return HelperFunction.dateFormatted(record.date)
  //   },
  // },
  // {
  //   title: 'Type',
  //   dataIndex: 'type',
  //   name: 'type',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Credit',
  //   dataIndex: 'Credit',
  //   name: 'Credit',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Debit',
  //   dataIndex: 'Debit',
  //   name: 'Debit',
  //   responsive: ['xs', 'sm'],
  // },
]
const statementByDateCOl = [
  ...BuisnessOverviewCols.statementByDate,
  // {
  //   title: '#',
  //   dataIndex: 'key',
  //   key: 'key',
  //   // render: (text, record, index) => index + 1,
  // },
  // {
  //   title: 'Date',
  //   dataIndex: 'date',
  //   name: 'date',
  //   responsive: ['xs', 'sm'],
  //   render: (text, record) => {
  //     return HelperFunction.dateFormatted(record.date)
  //   },
  // },
  // {
  //   title: 'Transaction Id',
  //   name: 'transaction_id',
  //   dataIndex: 'transaction_id',
  //   responsive: ['xs', 'sm'],
  //   sorter: (a, b) => a.transaction_id.localeCompare(b.transaction_id),
  // },
  // {
  //   title: 'Act Name',
  //   name: 'act_name',
  //   dataIndex: 'act_name',
  //   responsive: ['xs', 'sm'],
  //   // sorter: (a, b) => a.act_name.localeCompare(b.act_name || ''),
  // },
  // {
  //   title: 'Type',
  //   dataIndex: 'type',
  //   name: 'type',
  //   responsive: ['xs', 'sm'],
  //   // sorter: (a, b) => a.type.localeCompare(b.type),
  // },
  // {
  //   title: 'Credit',
  //   dataIndex: 'Credit',
  //   name: 'Credit',
  //   responsive: ['xs', 'sm'],
  //   // sorter: (a, b) => a.Credit.localeCompare(b.Credit),
  // },
  // {
  //   title: 'Debit',
  //   dataIndex: 'Debit',
  //   name: 'Debit',
  //   responsive: ['xs', 'sm'],
  //   // sorter: (a, b) => a.Debit.localeCompare(b.Debit),
  // },
]

const BuisnessOverview = props => {
  const [statementOfActData, setStatementOfActData] = useState([])
  const [statementBySubGrpData, setStatementBySubGrpData] = useState([])
  const [primaryGrpData, setPrimaryGrpData] = useState([])
  const [natureGrpData, setNatureGrpData] = useState([])
  const [statementByDate, setStatementByDate] = useState({})
  const [gridApi, setGridApi] = useState()

  const { reportName, dateValue, reportId, filter, handlePdfXlxCsv } = props
  // console.log(dateValue, 'dateValue', filter)
  // 1.

  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(filter.startDay).format('DD-MMM-YYYY'),
      endDate: moment(filter.endDate).format('DD-MMM-YYYY'),
      accId: filter.accId,
    }
    const fetchData = async () => {
      const result = await ReportServices.statementOfAccount(obj)
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setStatementOfActData(result || [])
      handlePdfXlxCsv({
        apiData: result,
        columns: statementOfAccColNew,
        fileName: 'Statement Of Accounts',
        salesValue: 'Statement Of Accounts',
        flag: 'statementOfAccount',
      })
    }
    if (Object.keys(org).length && filter.accId && reportName === 'Statement of Account') {
      fetchData()
    }
  }, [filter])

  //   2.
  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(filter.startDay).format('DD-MMM-YYYY'),
      endDate: moment(filter.endDate).format('DD-MMM-YYYY'),
      accId: filter.accId,
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.statementBySubGroup(obj)
      // console.log(result, 'getVendorBalance')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setStatementBySubGrpData(result || [])
      handlePdfXlxCsv({
        apiData: result,
        columns: statementOfAccCol,
        fileName: 'Statement By Subgroup',
        salesValue: 'Statement By Subgroup',
        flag: 'statementBySubPriNatureGroup',
      })
    }
    if (Object.keys(org).length && filter.accId && reportName === 'Statement By Subgroup') {
      fetchData()
    }
  }, [filter])

  //   3.
  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(filter.startDay).format('DD-MMM-YYYY'),
      endDate: moment(filter.endDate).format('DD-MMM-YYYY'),
      accId: filter.accId,
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.statementByPrimaryGroup(obj)
      // console.log(result, 'statementByPrimaryGroup')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setPrimaryGrpData(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: statementOfAccCol,
        fileName: 'Statement By Promarygroup',
        salesValue: 'Statement By Promarygroup',
        flag: 'statementBySubPriNatureGroup',
      })
    }
    if (Object.keys(org).length && filter.accId && reportName === 'Statement By Primarygroup') {
      fetchData()
    }
  }, [filter])

  //   4.
  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(filter.startDay).format('DD-MMM-YYYY'),
      endDate: moment(filter.endDate).format('DD-MMM-YYYY'),
      accId: filter.accId,
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.statementByNatureGrp(obj)
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      // console.log(result, 'purchaseOrderDetails')
      setNatureGrpData(result)
      handlePdfXlxCsv({
        apiData: result,
        columns: statementOfAccCol,
        fileName: 'Statement By Nature_Of_Account',
        salesValue: 'Statement By Nature_Of_Account',
        flag: 'statementBySubPriNatureGroup',
      })
    }
    if (
      Object.keys(org).length &&
      filter.accId &&
      reportName === 'Statement By Nature_Of_Account'
    ) {
      fetchData()
    }
  }, [filter])

  //   5.
  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format('DD-MMM-YYYY'),
      endDate: moment(dateValue[1]).format('DD-MMM-YYYY'),
      // accId: filter.accId,
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.statementByDate(obj)
      if (result?.DebitCredit?.length) {
        result.DebitCredit.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      const footerRowData = []
      // console.log(result, 'purchaseOrderDetails')
      setStatementByDate(result)
      handlePdfXlxCsv({
        apiData: result.DebitCredit,
        columns: statementByDateCOl,
        fileName: 'Statement By Date',
        salesValue: 'Statement By Date',
        flag: 'statementByDate',
        footerRowData: footerRowData || [],
      })
    }
    if (Object.keys(org).length && reportName === 'Statement By Date') {
      fetchData()
    }
  }, [dateValue])

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  return (
    <Row className="row details__page--content mt-3">
      <Col span={24} className="col-md-12 top__section p-0">
        <div className="page-header text-center pb-5">
          {/* <h4>Test</h4>  */}
          {/* {reportId && (
            <h3 className="reports-headerspacing">
              {' '}
              {tableCustInvoiceData[0] ? tableCustInvoiceData[0].customername : reportId}{' '}
            </h3>
          )} */}
          {!reportId && <h3 className="reports-headerspacing"> {reportName}</h3>}
          {/* <span>Basis: Accrual</span> */}
          <h5>{`from ${dateValue[0]} to ${dateValue[1]}`}</h5>
          <div className="tags"> </div>
        </div>
        <Col span={24} className="p-0">
          {/* {!params.reportId &&
        (params.report === 'Purchase Order By Vendor' ||
          params.report === 'Payables Summary' ||
          params.report === 'Payments Received' ||
          params.report === 'Debit Notes' ||
          params.report === 'Credit Notes') && ( */}

          {!reportId && reportName === 'Statement of Account' && (
            <>
              {/* <Table
              id="table__layout--css"
              className="statementOfAccount"
              pagination={false}
              dataSource={statementOfActData}
              columns={statementOfAccColNew}
              rowKey="id"
              // scroll={{ y: 450 }}
              summary={pageData => {
                const credit = pageData.reduce((sum, record) => sum + record.Credit, 0)
                const debit = pageData.reduce((sum, record) => sum + record.Debit, 0)
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
                      <Table.Summary.Cell>{credit}</Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <span>{debit}</span>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={statementOfActData}
                  columnDefs={singleLevelColumn(statementOfAccColNew)}
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
          {!reportId && reportName === 'Statement By Subgroup' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={statementBySubGrpData || []}
              columns={statementOfAccCol}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const credit = pageData.reduce((sum, record) => sum + record.Credit, 0)
                const debit = pageData.reduce((sum, record) => sum + record.Debit, 0)
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
                      <Table.Summary.Cell>{credit}</Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <span>{debit}</span>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={statementBySubGrpData}
                  columnDefs={singleLevelColumn(statementOfAccCol)}
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
          {!reportId && reportName === 'Statement By Primarygroup' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={primaryGrpData || []}
              columns={statementOfAccCol}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const credit = pageData.reduce((sum, record) => sum + record.Credit, 0)
                const debit = pageData.reduce((sum, record) => sum + record.Debit, 0)
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
                      <Table.Summary.Cell>{credit}</Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <span>{debit}</span>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={primaryGrpData}
                  columnDefs={singleLevelColumn(statementOfAccCol)}
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
          {!reportId && reportName === 'Statement By Nature_Of_Account' && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={natureGrpData || []}
              columns={statementOfAccCol}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const credit = pageData.reduce((sum, record) => sum + record.Credit, 0)
                const debit = pageData.reduce((sum, record) => sum + record.Debit, 0)
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
                      <Table.Summary.Cell>{credit}</Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <span>{debit}</span>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={natureGrpData}
                  columnDefs={singleLevelColumn(statementOfAccCol)}
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
          {!reportId && reportName === 'Statement By Date' && (
            <>
              {/* <Table
              id="table__layout--css"
              className="statementByDateTable"
              pagination
              dataSource={statementByDate.DebitCredit || []}
              columns={statementByDateCOl}
              rowKey="key"
              // scroll={{ x: 691 }}
              // footer={(data,text) => {
              //   // console.log(data,text,"text");
              //   return <div>Total</div>
              // }}
              summary={pageData => {
                const credit = pageData.reduce((sum, record) => sum + record.Credit, 0)
                const debit = pageData.reduce((sum, record) => sum + record.Debit, 0)
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
                      <Table.Summary.Cell>{credit}</Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <span>{debit}</span>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={statementByDate.DebitCredit}
                  columnDefs={singleLevelColumn(statementByDateCOl)}
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
          {/* {!reportId && reportName === 'Debit Notes' && (
            <Table
              pagination
              dataSource={debitNotesData}
              columns={debitNotesCol}
              rowKey="id"
              scroll={{ x: 691 }}
            />
          )}
          {!reportId && reportName === 'Credit Notes' && (
            <Table
              pagination
              dataSource={creditNotesData}
              columns={creditNotesCol}
              rowKey="id"
              scroll={{ x: 691 }}
            />
          )} */}
          {/* <ReportPdfContainer
            visible={isShownReciept}
            handleRecieptModal={() => setShownReciept(!isShownReciept)}
            quoteData={quotations || []}
            salesValue="Expense"
            flag="Expense"
            // dateValue={"dateValue"}
          /> */}
        </Col>
      </Col>
    </Row>
  )
}
const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(BuisnessOverview)

