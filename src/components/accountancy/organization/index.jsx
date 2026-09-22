import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Modal, Dropdown, Tabs, Select } from 'antd'
import { Link } from 'react-router-dom'
import OrgCols from '@/components/accountancy/JSON/Organization.json'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import HelperFunction from '@/services/helper'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import { DownOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons'
import ExportOptions from '@/components/accountancy/common/ExportOptions'

import OrganizationService from '@/services/organization'
// import tableData from './data.json'
// import tableData from './data.json'
const { confirm } = Modal

const { Option } = Select
const { TabPane } = Tabs

const mapStateToProps = ({ router, loginType }) => ({
  routerData: router,
  loginType,
})

const tableColumnsNew = [
  ...OrgCols.org,
  {
    title: 'Actions',
    key: 'actions',
    dataIndex: 'actions',
    cellRenderer: params => {
      const dt = params?.data

      return (
        <span>
          <Link to={`/user/organization/edit/${dt.orgCode}`}>
            <span className="editIcon">
              <EditOutlined />
            </span>
          </Link>
          {/* <button
            style={{ border: 'none', background: 'none' }}
            type="button"
            onClick={args => {
              args.stopPropagation()
              const liItem = args.target.parentElement.parentElement.parentElement
              return confirm({
                title: 'Do you Want to delete this item?',
                content: '',
                onOk() {
                  const fetchData = async () => {
                    const result = await OrganizationService.organizationDelete(record.id)
                    // console.log(result,'result')
                    liItem.remove()
                  }
                  fetchData()
                },
                onCancel() {
                  // console.log('Cancel')
                },
              })
            }}
          >
            Delete
          </button> */}
        </span>
      )
    },
  },
]

const OrganizationComp = routerData => {
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [customers, getCustomers] = useState([])
  const [page, setpage] = useState(1)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  const [gridApi, setGridApi] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const result = await OrganizationService.organizationList()
      // console.log(result, 'ress')
      if (result?.data?.length) {
        result.data.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getQuotations(result.data || [])
      const csvDataVal = HelperFunction.getDataForCSV(result.data, tableColumnsNew)
      // console.log(csvDataVal, 'csvDataVal')
      setCSVData(csvDataVal || [])
    }
    fetchData()
    // fetchCustData()
  }, [page])

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  // console.log(routerData, 'router')
  const routeName = routerData?.match?.path?.split('/')[2]
  return (
    <div>
      {routerData.loginType !== 'ADMIN' && (
        <div className="text-end mb-3">
          <Button color="secondary" className="me-2">
            <Dropdown
              trigger={["click"]}
              popupRender={() => <ExportOptions
                  handleRecieptModal={() => setShownReciept(!isShownReciept)}
                  csvData={csvData}
                  apiData={quotations}
                  columns={tableColumnsNew}
                  fileName="Organization List"
                />
              }
              className="me-2"
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
            <Link to="/user/organization/create" className="text-white">
              Create {routeName}
            </Link>
          </Button>

          <hr />
        </div>
      )}
      {/* <Table
        id="table__layout--css"
        // id="organizationTable"
        rowKey="id"
        columns={tableColumnsNew}
        dataSource={quotations}
        // pagination={false}
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

      <OtherPrimaryReport
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={quotations || []}
        salesValue="Company/Organizations"
        flag="Company"
        // dateValue={"dateValue"}
      />
    </div>
  )
}

export default connect()(OrganizationComp)

