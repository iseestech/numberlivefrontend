import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Tabs, Input, Dropdown, Form } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { DownOutlined, ReloadOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import HelperFunction from '@/services/helper'
import store from 'store'
import { connect } from 'react-redux'
import PurchaseService from '@/services/purchase'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import ReceiptPrint from '@/components/accountancy/common/receipt'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import tableData from './data.json'

const { TabPane } = Tabs

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const tableColumns = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    className: 'srNo',
    filter: 'agTextColumnFilter',

    // render: (text, record, index) => index + 1,
  },
  {
    title: 'Return#',
    dataIndex: 'purchasereturnno',
    key: 'purchasereturnno',
    filter: 'agTextColumnFilter',

    sorter: (a, b) => a.purchasereturnno.localeCompare(b.purchasereturnno),
    // sorter: (a, b) => HelperFunction.sortTableColumn(a,b,'amount','number'),
  },
  {
    title: 'Date',
    dataIndex: 'purchasereturndate',
    key: 'purchasereturndate',
    filter: 'agTextColumnFilter',

    sorter: (a, b) => a.purchasereturndate.localeCompare(b.purchasereturndate),
    render: (text, record) => {
      return HelperFunction.dateFormatted(record.purchasereturndate)
    },
  },
  // {
  //   title: 'Product#',
  //   dataIndex: 'product_id',
  //   key: 'product_id',
  // },
  // {
  //   title: 'Vendor#',
  //   dataIndex: 'vendorId',
  //   key: 'vendorId',
  // },
  // {
  //   title: 'Return Quantity',
  //   dataIndex: 'purchaseReturnQty',
  //   key: 'purchaseReturnQty',
  // },
  {
    title: 'Purchase Value',
    dataIndex: 'amount',
    key: 'amount',
    filter: 'agTextColumnFilter',
    isCustCellRender: true,
    cellRenderer: HelperFunction.renderCellAmt,
    // sorter: (a, b) => a.amount.localeCompare(b.amount),
    sorter: (a, b) => HelperFunction.sortTableColumn(a, b, 'amount', 'number'),
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
  // {
  //   title: 'Amount',
  //   dataIndex: 'amount',
  //   key: 'amount',
  // },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    className: 'actionCol',
    cellRenderer: params => {
      const dt = params?.data
      return (
        <Link to={`/purchase/return/${dt?.purchasereturnno}`}>
          <span className="viewIcon">
            <EyeOutlined />
          </span>
        </Link>
      )
    },
  },
]

const PurchaseReturnList = routerData => {
  const location = useLocation();
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
      const result = await PurchaseService.getAllPurchaseReturn(org.orgCode)
      // console.log(result, 'ress111')
      if (result && result.length) {
        const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
        if (result.length) {
          result.forEach((ele, i) => {
            ele.key = i + 1
          })
        }
        setCSVData(csvDataVal)
        getQuotations(result)
        setBaseData(result)
      } else {
        setCSVData([])
        getQuotations([])
      }
    }

    fetchData()
  }, [page])

  const search = value => {
    const filterTableVal = baseData.filter(o =>
      Object.keys(o).some(k =>
        String(o[k])
          .toLowerCase()
          .includes(value.toLowerCase()),
      ),
    )
    getQuotations(filterTableVal)
  }

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  // console.log(routerData, 'router')
  // const routeName = routerData.match.path.split('/')[2]
  const routeName = location?.pathname?.split('/')[2]
  // const { accepted, sent, draft, invoiced, declined } = quotationList
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-4">
        <div>
          <Input.Search allowClear placeholder="Search by..." enterButton onSearch={search} />
        </div>{' '}
        <div className="text-end">
          <Button color="secondary" className="me-2 mb-2">
            <Dropdown trigger={["click"]}
              popupRender={ () =>
                <ExportOptions
                  handleRecieptModal={() => setShownReciept(!isShownReciept)}
                  csvData={csvData}
                  apiData={quotations}
                  columns={tableColumns}
                  fileName="Purchase Return List"
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
            <Link
              to={`/purchase/${routeName.substring(0, routeName.length - 1)}/create`}
              className="text-white"
            >
              Create {routeName}
            </Link>
          </Button>
        </div>
      </div>

      <div className="ag-theme-alpine agggrid--table__container">
        {/* <AgGridReact rowData={quotations} columnDefs={tableField} /> */}
        <AgGridReact
          theme={'legacy'}
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
        // detailsInfo={[]}
        salesValue="Purchase Return List"
        flag="PurchaseReturnList"
        // dateValue={"dateValue"}
      />
    </div>
  )
}

export default connect()(PurchaseReturnList)

