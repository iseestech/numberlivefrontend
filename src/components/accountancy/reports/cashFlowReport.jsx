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
import DashboardService from '@/services/dashboard'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '../sales/aggrid/singleLevelColumn'
import BuisnessOverview from '../JSON/BuisnessOverview'

const custBalColumn = [...BuisnessOverview.cashFlowStatement]

const CashFlowReport = props => {
  const [tableCustData, setTableCustData] = useState([])
  const [gridApi, setGridApi] = useState()
  const { reportName, dateValue, reportId, handlePdfXlxCsv } = props

  useEffect(() => {
    const org = JSON.parse(localStorage.getItem('selectedOrg'))
    const curryear = new Date().getFullYear()
    const obj = {
      orgCode: org?.orgCode || '',
      endDate: moment().format('DD-MMM-YYYY'),
      startDate: moment()
        .add(-1, 'year')
        .format('DD-MMM-YYYY'),
    }

    // console.log('Obj', obj)
    const fetchData = async () => {
      //   const result = await ReportServices.billDetails(obj)
      const result = await DashboardService.cashflowdata(obj)

      // console.log(result, 'Sales By getCustomerBalanceDetails')
      if (result.data && result?.data.length) {
        result.data.forEach((ele, i) => {
          ele.key = i + 1
          ele.date = HelperFunction.dateFormatted(`${ele.month}/1/${ele.Year}`)
        })
      }
      setTableCustData(result?.data || [])
      handlePdfXlxCsv({
        apiData: result?.data || [],
        columns: custBalColumn,
        fileName: 'Cash Flow Statement',
        salesValue: 'Cash Flow Statement',
        flag: 'cashFlowStatemen',
      })
    }
    if (Object.keys(org).length && reportName === 'Cash Flow Statement') {
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
          {reportId && (
            <h3 className="reports-headerspacing">
              {' '}
              {tableCustData[0] ? tableCustData[0].customername : reportId}{' '}
            </h3>
          )}
          {!reportId && <h3 className="reports-headerspacing"> {reportName}</h3>}
          {/* <span>Basis: Accrual</span> */}
          <h5>{`from ${dateValue[0]} to ${dateValue[1]}`}</h5>
          <div className="tags"> </div>
        </div>
        <Col span={24} className="p-0">
          {!reportId && reportName === 'Cash Flow Statement' && (
            <>
              {/* // <Table
            //   id="table__layout--css"
            //   pagination
            //   dataSource={tableCustData}
            //   columns={custBalColumn}
            //   rowKey="id"
            //   // scroll={{ x: 691 }}
            //   summary={pageData => {
            //     const closingvalue = pageData.reduce((sum, record) => sum + record.closingvalue, 0)
            //     const openingvalue = pageData.reduce((sum, record) => sum + record.openingvalue, 0)
            //     const InFlow = pageData.reduce((sum, record) => sum + record.InFlow, 0)
            //     const OutFlow = pageData.reduce((sum, record) => sum + record.OutFlow, 0)

            //     return (
            //       <>
            //         <Table.Summary.Row
            //           className="ant-table-footer"
            //           style={{
            //             fontWeight: 'bold',
            //           }}
            //         >
            //           <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
            //           <Table.Summary.Cell>Total</Table.Summary.Cell>
            //           <Table.Summary.Cell>{closingvalue}</Table.Summary.Cell>
            //           <Table.Summary.Cell>{openingvalue}</Table.Summary.Cell>
            //           <Table.Summary.Cell>{InFlow}</Table.Summary.Cell>
            //           <Table.Summary.Cell>{OutFlow}</Table.Summary.Cell>
            //         </Table.Summary.Row>
            //       </>
            //     )
            //   }}
            // /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  rowData={tableCustData}
                  columnDefs={singleLevelColumn(custBalColumn)}
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
const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(CashFlowReport)

