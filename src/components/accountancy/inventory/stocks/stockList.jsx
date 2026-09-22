import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Tabs, Select, Dropdown, DatePicker } from 'antd'
import { DownOutlined, ReloadOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import InventoryCols from '@/components/accountancy/JSON/Inventory'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import moment from 'moment'
import HelperFunction from '@/services/helper'
import InventoryService from '@/services/inventory'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import CustomerService from '@/services/customer'
import store from 'store'
import tableData from './data.json'

const { Option } = Select
const { TabPane } = Tabs

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const tableColumns = [
  {
    title: 'Stock#',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Reference',
    dataIndex: 'reference',
    key: 'reference',
  },
  {
    title: 'Customer',
    dataIndex: 'firstName',
    key: 'firstName',
  },
  {
    title: 'Date',
    dataIndex: 'estimateDate',
    key: 'estimateDate',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  // {
  //   title: 'Actions',
  //   dataIndex: 'actions',
  //   key: 'actions',
  //   render: (text, record) => {
  //     // console.log(text, record)
  //     return <Link to={`/inventory/stock/${record.id}`}>click here</Link>
  //   },
  // },
]

const tableColumnsNew = [...InventoryCols.stocks]

const StockList = routerData => {
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [customers, getCustomers] = useState([])
  const [page, setpage] = useState(1)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  const [gridApi, setGridApi] = useState()

  const fetchData = async (date, orgCode) => {
    const result = await InventoryService.getStockList(date, orgCode)
    // console.log(result?.data, 'ress')
    if (result && result?.data?.length) {
      // console.log(result, 'IFFFFFF')
      const csvDataVal = HelperFunction.getDataForCSV(result, tableColumnsNew)
      if (result?.data?.length) {
        result.data.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      setCSVData(csvDataVal)
      getQuotations(result.data)
    } else {
      setCSVData([])
      getQuotations([])
    }
  }

  useEffect(() => {
    const org = store.get('selectedOrg')
    const currDate = moment(new Date()).format('YYYY/MM/DD')
    fetchData(currDate, org.orgCode)
  }, [page])

  const selectCust = e => {
    // console.log(e, 'e')
    fetchData(e)
  }
  const handleDate = value => {
    const org = store.get('selectedOrg')
    const currDate = moment(value).format('YYYY/MM/DD')
    fetchData(currDate, org.orgCode)
  }

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  // console.log(quotations, 'router')
  const { accepted, sent, draft, invoiced, declined } = quotationList
  return (
    <div>
      <div className="text-end mb-3">
        {/* <Button
          color="secondary"
          // outline
          className="me-2 mb-2"
          size="large"
          onClick={() => setShownReciept(!isShownReciept)}
        >
          <strong>In-Progress</strong>
        </Button> */}
        <Button color="secondary" className="me-2 mb-2">
          <Dropdown
            trigger={["click"]}
            popupRender={() =><ExportOptions
                handleRecieptModal={() => setShownReciept(!isShownReciept)}
                csvData={csvData}
                apiData={quotations}
                columns={tableColumnsNew}
                fileName="Stock List"
              />
            }
            className="me-2 mb-2"
          >
            <a className="ant-dropdown-link">
              Export As <DownOutlined />
            </a>
          </Dropdown>
        </Button>
        <DatePicker
          onChange={handleDate}
          className="mb-3"
          defaultValue={moment(new Date(), 'DD/MM/YYYY')}
          // value={moment(new Date(), 'DD/MM/YYYY')}
          style={{ width: '250px' }}
          format="DD MMM YYYY"
        />
        {/* <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
          <strong>
            {' '}
            <Link
              to={`/inventory/${routeName.substring(0, routeName.length - 1)}/create`}
              className="text-white"
            >
              Create {routeName}
            </Link>
          </strong>
        </Button> */}
        {/* <Select style={{ width: 240 }} placeholder="Select Customer" onChange={e => selectCust(e)}>
          {customers.map(item => (
            <Option value={item.customer_id} key={`${item.company_name}_${item.customer_id}`}>
              {`${item.customer_fname} ${item.customer_lname} (${item.company_name})`}
            </Option>
          ))}
        </Select>
        <hr /> */}
      </div>
      {/* <Table
        id="table__layout--css"
        rowKey="id"
        columns={tableColumnsNew}
        dataSource={quotations}
        pagination
        showSorterTooltip={false}
      /> */}
      <div className="ag-theme-alpine agggrid--table__container">
        <AgGridReact
          theme={"legacy"}
          rowData={quotations}
          columnDefs={singleLevelColumn(tableColumnsNew)}
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
          <Table columns={tableColumns} dataSource={tableData} pagination={false} />
        </TabPane>
        <TabPane tab={`Draft (${draft && draft.length})`} key="2">
          <Table columns={tableColumns} dataSource={draft} pagination={false} />
        </TabPane>
        <TabPane tab={`Sent (${sent && sent.length})`} key="3">
          <Table columns={tableColumns} dataSource={sent} pagination={false} />
        </TabPane>
        <TabPane tab={`Declined (${declined && declined.length})`} key="4">
          <Table columns={tableColumns} dataSource={declined} pagination={false} />
        </TabPane>
        <TabPane tab={`Accepted (${accepted && accepted.length})`} key="5">
          <Table columns={tableColumns} dataSource={accepted} pagination={false} />
        </TabPane>
        <TabPane tab={`Invoiced (${invoiced && invoiced.length})`} key="6">
          <Table columns={tableColumns} dataSource={invoiced} pagination={false} />
        </TabPane>
      </Tabs> */}
      <OtherPrimaryReport
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={quotations || []}
        salesValue="Stock"
        flag="Stock"
        // dateValue={"dateValue"}
      />
    </div>
  )
}

export default connect()(StockList)
