import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Dropdown, Tabs } from 'antd'
import { DownOutlined, ReloadOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import JournalCols from '@/components/accountancy/JSON/Journal'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import JournalService from '@/services/journal'
import HelperFunction from '@/services/helper'
import tableData from './data.json'

const { TabPane } = Tabs

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const tableColumns = [
  ...JournalCols.mannualJournal,
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    className: 'actionCol',
    cellRenderer: params => {
      const dt = params?.data

      return (
        <Link to={`/accounts/journal/${dt?.journelNo}`}>
          <span className="viewIcon">
            <EyeOutlined />
          </span>
        </Link>
      )
    },
  },
]

const JournalList = routerData => {
  const location = useLocation()
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [page, setpage] = useState(1)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  const [gridApi, setGridApi] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const result = await JournalService.JournalList()
      if (result && result.data.length) {
        const csvDataVal = HelperFunction.getDataForCSV(result.data, tableColumns)
        if (result?.data?.length) {
          result.data.forEach((ele, i) => {
            ele.key = i + 1
          })
        }
        setCSVData(csvDataVal)
        getQuotations(result.data)
        // getQuotationsList(quoteData)
      } else {
        setCSVData([])
        getQuotations([])
        // getQuotationsList(quoteData)
      }
    }

    fetchData()
  }, [page])

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  const routeName = location?.pathname?.split('/')[2]
  // const { accepted, sent, draft, invoiced, declined } = quotationList
  return (
    <div>
      <div className="text-end mb-3">
        <Button color="secondary" className="me-2">
          <Dropdown
            trigger={["click"]}
            popupRender={() => <ExportOptions
                handleRecieptModal={() => setShownReciept(!isShownReciept)}
                csvData={csvData}
                apiData={quotations}
                columns={tableColumns}
                fileName="Journal List"
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
          <Link to="/accounts/journal/create" className="text-white">
            Create {routeName}
          </Link>
        </Button>
      </div>
      {/* <Table
        id="table__layout--css"
        rowKey="purchase_id"
        columns={tableColumns}
        dataSource={quotations || []}
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
        salesValue="Journal"
        flag="Journal"
        // dateValue={"dateValue"}
      />
    </div>
  )
}

export default connect()(JournalList)

