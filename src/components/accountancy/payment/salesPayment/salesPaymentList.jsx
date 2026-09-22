import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Tabs, Dropdown, Input } from 'antd'
import { DownOutlined, ReloadOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PurchaseService from '@/services/purchase'
import CreatePayment from '@/components/accountancy/common/createPayment'
import QuotationService from '@/services/sales'
import SalesColumns from '@/components/accountancy/JSON/SalesColumnNew'

import store from 'store'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import HelperFunction from '@/services/helper'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import tableData from './data.json'

const { TabPane } = Tabs

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const tableColumns = [
  ...SalesColumns.SalesPaymentCols,
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    cellRenderer: params => {
      const dt = params?.data
      const poNumber = dt && dt.paymentno
      return (
        <Link to={`/sales/payment/pay/${poNumber}`}>
          {' '}
          <span className="viewIcon">
            <EyeOutlined />
          </span>
        </Link>
      )
    },
  },
]

const SalesPaymentList = routerData => {
  const location = useLocation()
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [page, setpage] = useState(1)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  const [baseData, setBaseData] = useState([])
  const [gridApi, setGridApi] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const org = store.get('selectedOrg')

      const result = await QuotationService.salesInvoicePayment(org.orgCode)
      // console.log(result, 'ress111')
      if (result && result.length) {
        const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
        if (result.length) {
          result.forEach((ele, i) => {
            ele.key = i + 1
          })
        }
        // getQuotations(result.data)
        setCSVData(csvDataVal)
        getQuotations(result)
        // getQuotationsList()
        setBaseData(result)
      } else {
        setCSVData([])
        getQuotations([])
        // getQuotationsList(quoteData)
      }
    }

    fetchData()
  }, [page])

  const onHandleChange = (e, value) => {
    // console.log(e.target.value, value)
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

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  // console.log(routerData, 'router')
  const routeName = location?.pathname?.split('/')[2]
  // const { accepted, sent, draft, invoiced, declined } = quotationList
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-3">
        <div>
          <Input.Search allowClear placeholder="Search by..." enterButton onSearch={search} />
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
                  fileName="Sales Payment List"
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
            <Link to="/sales/payment/create" className="text-white">
              Create New {routeName}
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
        salesValue="Sales Payments"
        flag="SalesPayments"
        // dateValue={"dateValue"}
      />
    </div>
  )
}

export default connect()(SalesPaymentList)

