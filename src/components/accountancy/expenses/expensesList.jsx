import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Dropdown, Tabs } from 'antd'
import { DownOutlined, ReloadOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import InvetroyAdjCols from '@/components/accountancy/JSON/Inventory'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import ExpensesService from '@/services/expenses'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import HelperFunction from '@/services/helper'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'

import tableData from './data.json'

const { TabPane } = Tabs

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const tableColumns = [
  ...InvetroyAdjCols?.expenses,

  // {
  //   title: '#',
  //   dataIndex: 'key',
  //   key: 'key',
  //   className: 'srNo',
  //   // render: (text, record, index) => index + 1,
  // },
  // {
  //   title: 'Date',
  //   dataIndex: 'date',
  //   key: 'date',
  //   render: (text, record) => {
  //     return HelperFunction.dateFormatted(record.date)
  //   },
  // },
  // {
  //   title: 'Expense Account',
  //   dataIndex: 'expAccount',
  //   key: 'expAccount',
  //   sorter: (a, b) => a.expAccount.localeCompare(b.expAccount),

  //   render: (text, record) => {
  //     // console.log(text, record)
  //     const length = record.expensesAccountDto.length - 1
  //     return (
  //       <span>
  //         {record.expensesAccountDto.map((item, i) => (
  //           <span>{`${item.expensesAct}${length !== i ? ', ' : ''}`}</span>
  //         ))}
  //       </span>
  //     )
  //   },
  // },
  // {
  //   title: 'Vendor Name',
  //   dataIndex: 'vendorName',
  //   key: 'vendorName',
  //   sorter: (a, b) => a.vendorName.localeCompare(b.vendorName),
  // },
  // {
  //   title: 'Paid Through',
  //   dataIndex: 'paidThrough',
  //   key: 'paidThrough',
  //   sorter: (a, b) => a.paidThrough.localeCompare(b.paidThrough),
  // },
  // {
  //   title: 'Customer Name',
  //   dataIndex: 'customerName',
  //   key: 'customerName',
  //   sorter: (a, b) => a.customerName.localeCompare(b.customerName),
  // },

  // {
  //   title: 'Amount',
  //   dataIndex: 'amount',
  //   key: 'amount',
  //   // sorter: (a, b) => a.amount.localeCompare(b.amount),
  //   sorter: (a, b) => HelperFunction.sortTableColumn(a, b, 'amount', 'number'),
  // },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    className: 'actionCol',
    cellRenderer: params => {
      const dt = params?.data || {}
      return (
        <Link to={`/exp/expense/${dt.expenseNo}`}>
          <span className="viewIcon">
            <EyeOutlined />
          </span>
        </Link>
      )
    },
  },
]

const ExpensesList = routerData => {
  const location = useLocation()
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [page, setpage] = useState(1)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  const [gridApi, setGridApi] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const result = await ExpensesService.expensesList()
      // console.log(result, 'ress111')
      if (result && result.length) {
        const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
        if (result?.length) {
          result.forEach((ele, i) => {
            ele.key = i + 1
          })
        }
        setCSVData(csvDataVal)
        getQuotations(result)
      } else {
        getQuotations([])
      }
    }
    fetchData()
  }, [page])

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  // console.log(routerData, 'router')
  const routeName = location?.pathname?.split('/')[2]
  // const { accepted, sent, draft, invoiced, declined } = quotationList
  return (
    <div>
      <div className="text-end mb-3">
        <Button color="secondary" className="me-2 mb-2">
          <Dropdown
            trigger={['click']}
            popupRender={() => <ExportOptions
                handleRecieptModal={() => setShownReciept(!isShownReciept)}
                csvData={csvData}
                apiData={quotations}
                columns={tableColumns}
                fileName="Expenses List"
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
          onClick={() => setShownReciept(!isShownReciept)}
        >
          <strong>In-Progress</strong>
        </Button> */}
        <Button type="primary" size="medium" className="text-center w-10 mb-1" htmlType="submit">
          <Link to="/exp/expense/create" className="text-white">
            Create {routeName}
          </Link>
        </Button>
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
        salesValue="Expense"
        flag="Expense"
        // dateValue={"dateValue"}
      />
    </div>
  )
}

export default connect()(ExpensesList)

