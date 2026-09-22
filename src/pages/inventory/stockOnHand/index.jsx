import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Tabs, Dropdown, Select } from 'antd'
import { DownOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Inventory from '@/components/accountancy/JSON/Inventory'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import PhysicalStocsService from '@/services/physicalStocks'
import InventoryService from '@/services/inventory'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import HelperFunction from '@/services/helper'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import store from 'store'

const { Option } = Select
const { TabPane } = Tabs

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const tableColumns = [
  ...Inventory.stockOnHand,
  //   {
  //     title: 'Actions',
  //     dataIndex: 'actions',
  //     key: 'actions',
  //     className: 'actionCol',
  //     cellRenderer: params => {
  //       const dt = params?.data || {}
  //       return (
  //         <Link to={`/inventory/inventory-adjustment/edit/${dt?.id}`}>
  //           <span className="editIcon">
  //             <EditOutlined />
  //           </span>
  //         </Link>
  //       )
  //     },
  //   },
]

const InventoryAdjustmentList = () => {
  const params = useParams()
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [customers, getCustomers] = useState([])
  const [page, setpage] = useState(1)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  const [gridApi, setGridApi] = useState()

  useEffect(() => {
    const fetchData = async id => {
      const org = store.get('selectedOrg')

      const result = await InventoryService.getStockOnHandList(org.orgCode)
      // console.log(result, 'ress')
      if (result && result.data.length) {
        const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
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
    fetchData()
    // fetchCustData()
  }, [page])

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  // console.log(quotations, 'quotations')
  return (
    <div>
      <div className="text-end mb-3">
        {/* <Button color="secondary" className="me-2 mb-2">
          <Dropdown
            overlay={
              <ExportOptions
                handleRecieptModal={() => setShownReciept(!isShownReciept)}
                csvData={csvData}
                apiData={quotations}
                columns={tableColumns}
                fileName="Inventory Adj List"
              />
            }
            className="me-2 mb-2"
          >
            <a className="ant-dropdown-link">
              Export As <DownOutlined />
            </a>
          </Dropdown>
        </Button> */}
        {/* <Button
          color="secondary"
          // outline
          className="me-2 mb-2"
          size="large"
          onClick={() => setShownReciept(!isShownReciept)}
        >
          <strong>In-Progress</strong>
        </Button> */}
        {/* <Button type="primary" size="medium" className="text-center w-10 mb-1" htmlType="submit">
          <Link
            to={`/inventory/${routeName.substring(0, routeName.length - 1)}/create`}
            className="text-white"
          >
            Create Inventory Adjustment
          </Link>
        </Button> */}

        {/* <hr /> */}
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

      <OtherPrimaryReport
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={quotations || []}
        salesValue="Inventory Adjustment"
        flag="InventoryAdjustment"
        // dateValue={"dateValue"}
      />
    </div>
  )
}

export default connect()(InventoryAdjustmentList)
