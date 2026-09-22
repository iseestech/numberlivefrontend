import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Tabs, Dropdown, Input } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { DownOutlined, ReloadOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import store from 'store'
import { connect } from 'react-redux'
import PurchaseService from '@/services/purchase'
import VendorAdvPaymentService from '@/services/purchase/vendorAdvService'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import QuotationService from '@/services/sales'
import CreatePayment from '@/components/accountancy/common/createPayment'
import HelperFunction from '@/services/helper'
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
    title: 'Pyament #',
    dataIndex: 'paymentno',
    key: 'paymentno',
    filter: 'agTextColumnFilter',

    sorter: (a, b) => a.paymentno.localeCompare(b.paymentno),
  },
  // {
  //   title: 'Reference',
  //   dataIndex: 'reference',
  //   key: 'reference',
  // },
  {
    title: 'Vendor Name',
    dataIndex: 'vendorname',
    key: 'vendorname',
    filter: 'agTextColumnFilter',

    sorter: (a, b) => a.vendorname.localeCompare(b.vendorname),
  },
  {
    title: 'Payment Date',
    dataIndex: 'paymentdate',
    key: 'paymentdate',
    filter: 'agTextColumnFilter',

    render: (text, record) => {
      return HelperFunction.dateFormatted(record.paymentdate)
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
  // {
  //   title: 'Amount',
  //   dataIndex: 'total',
  //   key: 'total',
  // },
  {
    title: 'Amount Paid',
    dataIndex: 'amountpaid',
    key: 'amountpaid',
    filter: 'agTextColumnFilter',
    isCustCellRender: true,
    cellRenderer: HelperFunction.renderCellAmt,
    // sorter: (a, b) => a.amountpaid.localeCompare(b.amountpaid),
    sorter: (a, b) => HelperFunction.sortTableColumn(a, b, 'amountpaid', 'number'),
  },
  // {
  //   title: 'Due Amount',
  //   dataIndex: 'due_amount',
  //   key: 'due_amount',
  //   sorter: (a, b) => HelperFunction.sortTableColumn(a, b, 'due_amount', 'number'),
  // },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    className: 'actionCol',

    cellRenderer: params => {
      const dt = params?.data
      return (
        <Link to={`/purchase/payment/pay/${dt?.paymentno}`}>
          <span className="viewIcon">
            <EyeOutlined />
          </span>
        </Link>
      )
    },
  },
]

const advTableColumns = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    className: 'srNo',
    filter: 'agTextColumnFilter',

    // render: (text, record, index) => index + 1,
  },
  {
    title: 'Pyament #',
    dataIndex: 'paymentNo',
    key: 'paymentNo',
    filter: 'agTextColumnFilter',

    // sorter: (a, b) => a.paymentno.localeCompare(b.paymentno),
  },
  // {
  //   title: 'Reference',
  //   dataIndex: 'reference',
  //   key: 'reference',
  // },
  {
    title: 'Vendor Name',
    dataIndex: 'vendorname',
    key: 'vendorname',
    filter: 'agTextColumnFilter',

    sorter: (a, b) => a.vendorName.localeCompare(b.vendorName),
  },
  {
    title: 'Payment Date',
    dataIndex: 'paymentDate',
    key: 'paymentDate',
    filter: 'agTextColumnFilter',

    render: (text, record) => {
      return HelperFunction.dateFormatted(record.paymentDate)
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
  // {
  //   title: 'Amount',
  //   dataIndex: 'total',
  //   key: 'total',
  // },
  {
    title: 'Amount Paid',
    dataIndex: 'amountPaid',
    key: 'amountPaid',
    filter: 'agTextColumnFilter',
    isCustCellRender: true,
    cellRenderer: HelperFunction.renderCellAmt,
    // sorter: (a, b) => a.amountpaid.localeCompare(b.amountpaid),
    sorter: (a, b) => HelperFunction.sortTableColumn(a, b, 'amountPaid', 'number'),
  },
  // {
  //   title: 'Due Amount',
  //   dataIndex: 'due_amount',
  //   key: 'due_amount',
  //   sorter: (a, b) => HelperFunction.sortTableColumn(a, b, 'due_amount', 'number'),
  // },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    className: 'actionCol',

    cellRenderer: params => {
      const dt = params?.data
      return (
        <Link to={`/purchase/vendorPayment/pay/${dt?.paymentNo}`}>
          <span className="viewIcon">
            <EyeOutlined />
          </span>
        </Link>
      )
    },
  },
]
const PurchasePaymentList = routerData => {
const location = useLocation()
  const [quotations, getQuotations] = useState([])
  const [advPaymentList, setAdvPaymentList] = useState([])

  const [quotationList, getQuotationsList] = useState({})
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  const [baseData, setBaseData] = useState([])
  // Adv payment data
  const [advCsvData, setAdvCSVData] = useState([])
  const [advBaseData, setAdvBaseData] = useState([])
  const [activeTab, setActiveTab] = useState('1')
  const [gridApi, setGridApi] = useState()

  const handleRecieptModal = () => {
    setShownReciept(!isShownReciept)
  }
  const [page, setpage] = useState(1)
  useEffect(() => {
    const org = store.get('selectedOrg')
    const fetchData = async () => {
      const result = await PurchaseService.getAllPurchasePayment(org.orgCode)
      // console.log(result, 'ress111')
      if (result && result.length) {
        const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
        if (result.length) {
          result.forEach((ele, i) => {
            ele.key = i + 1
          })
        }
        setCSVData(csvDataVal)
        getQuotations(result || [])
        setBaseData(result || [])
      } else {
        setCSVData([])
        getQuotations([])
      }
    }

    const fetchAdvData = async () => {
      // const result = await VendorAdvPaymentService.getVendorInvoices('VI-3002', org.orgCode)
      const result = await VendorAdvPaymentService.getAllVendorAdvPayment()
      const { data } = result
      if (data && data?.length) {
        const csvDataVal = HelperFunction.getDataForCSV(data, advTableColumns)
        if (data?.length) {
          data.forEach((ele, i) => {
            ele.key = i + 1
          })
        }
        // console.log(result, 'log ===>')

        setAdvCSVData(csvDataVal)
        setAdvPaymentList(data || [])
        setAdvBaseData(data || [])
      } else {
        setAdvCSVData([])
        setAdvPaymentList([])
      }
    }
    fetchData()
    fetchAdvData()
  }, [page])

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

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

  const changeTab = activeKey => {
    setActiveTab(activeKey)
  }

  // console.log(routerData, 'router', advPaymentList)
  const routeName = location?.pathname?.split('/')[2]
  // const { accepted, sent, draft, invoiced, declined } = quotationList
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-4">
        <div>
          <Input.Search allowClear placeholder="Search by..." enterButton onSearch={search} />
        </div>
        {/* <div className="text-end">
          <Button
            color="secondary"
            outline
            className="me-2 mb-2"
            onClick={() => handleRecieptModal()}
          >
            Print
          </Button>
        </div> */}

        <div className="text-end">
          <Button color="secondary" className="me-2 mb-2">
            <Dropdown
              trigger={["click"]}
              popupRender={
                activeTab === '1' ? () => (
                  <ExportOptions
                    handleRecieptModal={() => setShownReciept(!isShownReciept)}
                    csvData={csvData}
                    apiData={quotations}
                    columns={tableColumns}
                    fileName="Vendor Payment List"
                  />
                ) :  () => (
                  <ExportOptions
                    handleRecieptModal={() => setShownReciept(!isShownReciept)}
                    csvData={advCsvData}
                    apiData={advPaymentList}
                    columns={advTableColumns}
                    fileName="Purchase Payment List"
                  />
                )
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
            <strong>Print</strong>
          </Button> */}
          <Button type="primary" size="medium" className="text-center w-10 mb-1" htmlType="submit">
            <Link to="/purchase/payment/create" className="text-white">
              Create New {routeName}
            </Link>
          </Button>
        </div>
      </div>

      <Tabs
        defaultActiveKey="1"
        className="antd__tab--content"
        activeKey={activeTab}
        onChange={changeTab}
      >
        <TabPane tab="Purchase Payment" key="1">
          <div className="ag-theme-alpine agggrid--table__container">
            {/* <AgGridReact rowData={quotations} columnDefs={tableField} /> */}
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
        </TabPane>
        <TabPane tab="Advance Payment" key="2">
          <div className="ag-theme-alpine agggrid--table__container">
            {/* <AgGridReact rowData={quotations} columnDefs={tableField} /> */}
            <AgGridReact
                 theme={"legacy"}
              rowData={advPaymentList}
              columnDefs={singleLevelColumn(advTableColumns)}
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
        </TabPane>
      </Tabs>
      <OtherPrimaryReport
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={activeTab === '1' ? quotations || [] : advPaymentList || []}
        salesValue={activeTab === '1' ? 'Purchase Payment List' : 'Vendor Payment List'}
        flag={activeTab === '1' ? 'PurchasePaymentList' : 'VendorPaymentList'}
        // dateValue={"dateValue"}
      />
    </div>
  )
}

export default connect()(PurchasePaymentList)

