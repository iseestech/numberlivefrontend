import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Tabs, Dropdown, Input } from 'antd'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import { UploadOutlined, DownOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { AgGridReact } from 'ag-grid-react'
import QuotationService from '@/services/sales'
import HelperFunction from '@/services/helper'
import SalesColumns from '@/components/accountancy/JSON/SalesColumnNew'

import tableData from './data.json'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '../aggrid/singleLevelColumn'

const { TabPane } = Tabs

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const OtherIncomeList = () => {
  const location = useLocation()
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [page, setpage] = useState(1)
  const [csvData, setCSVData] = useState([])
  const [isShownReciept, setShownReciept] = useState(false)
  const [baseData, setBaseData] = useState([])
  const [gridApi, setGridApi] = useState()

  const tableColumns = [
    ...SalesColumns.SalesOtherIncomeCols,
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      cellRenderer: params => {
        const dt = params?.data
        const poNumber = dt && dt.id
        return (
          <>
            <Link to={`/sale/other-income/edit/${poNumber}`}>
              <span className="editIcon">
                <EditOutlined />
              </span>
            </Link>
            <span>&nbsp;|</span>
            <Button
              color="danger"
              className="me-2 mb-2 p-0"
              onClick={async () => {
                const result = await QuotationService.deleteOtherIncome(poNumber)
                if (result.statusCode === 200) {
                  fetchData()
                }
              }}
              style={{ border: 'none', background: 'none' }}
            >
              <span className="deleteIcon">
                <DeleteOutlined />
              </span>
            </Button>
          </>
        )
      },
    },
  ]

  const fetchData = async () => {
    const result = await QuotationService.getAllOtherIncome()
    // console.log(result, 'ress111')
    if (result && result.data.length) {
      const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
      setCSVData(csvDataVal)
      if (result?.data?.length) {
        result.data.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getQuotations(result.data)
      setBaseData(result.data)
    } else {
      setCSVData([])
      getQuotations([])
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

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

  const onHandleChange = (e, value) => {
    // console.log(e.target.value, value)
  }

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  // console.log(routerData, 'router')
  const routeName = location?.pathname?.split('/')[2]
  const { accepted, sent, draft, approved, declined } = quotationList
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
                  fileName="Other Income"
                />
              }
              className="me-2 mb-2"
            >
              <a className="ant-dropdown-link">
                Export As <DownOutlined />
              </a>
            </Dropdown>
          </Button>
          &nbsp;
          <Button type="primary" size="medium" className="text-center w-10 mb-1" htmlType="submit">
            <Link
              to={`/sale/${routeName.substring(0, routeName.length - 1)}/create`}
              className="text-white"
            >
              Create Other Income
            </Link>
          </Button>
        </div>
      </div>
      <OtherPrimaryReport
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={quotations || []}
        salesValue="Other Income"
        flag="OtherIncome"
        // dateValue={"dateValue"}
      />
      {/* <Table
        id="table__layout--css"
        rowKey="quoteNumber"
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
    </div>
  )
}

export default connect()(OtherIncomeList)
