import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Tabs, Dropdown, Modal } from 'antd'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import { DownOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import HelperFunction from '@/services/helper'
import { Link } from 'react-router-dom'
import chartOfAccCols from '@/components/accountancy/JSON/ChartOfAccounts'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import ChartOfAccService from '@/services/chartOfAccount'
import store from 'store'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import CreateChartOfAccount from './createChartOfAccount'
import tableData from './data.json'
import CreateAccountGroup from './createAccountGroup'

const { TabPane } = Tabs

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const ChartOfAccountList = routerData => {
  const [accountsObj, getAccountsObj] = useState({})
  const [chartData, getChartData] = useState({})
  const [addEdit, setAddEdit] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [page, setpage] = useState(1)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  const [gridApi, setGridApi] = useState()

  const tableAllColumns = [
    ...chartOfAccCols.allAccounts,
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'actionCol',
      cellRenderer: params => {
        const dt = params?.data

        return (
          <>
            <Button
              type="button"
              onClick={() => passDataToMoad(dt, false)}
              className="p-0"
              style={{ border: 'none', background: 'none' }}
            >
              <span className="editIcon">
                <EditOutlined />
              </span>
            </Button>{' '}
            {/* <span>&nbsp; | </span>
            <Button type="button">
              <span className="deleteIcon">
                <DeleteOutlined />
              </span>
            </Button> */}
          </>
        )
      },
    },
  ]

  const tableColumns = [
    ...chartOfAccCols.tableColumns,

    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      cellRenderer: params => {
        const dt = params?.data

        return (
          <>
            <Button
              type="button"
              onClick={() => passDataToMoad(dt, false)}
              className="p-0"
              style={{ border: 'none', background: 'none' }}
            >
              <span className="editIcon">
                <EditOutlined />
              </span>
            </Button>{' '}
            {/* |<Button type="button">
              <span className="deleteIcon">
                <DeleteOutlined />
              </span>
            </Button> */}
          </>
        )
      },
    },
  ]

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    const obj = {
      LIABILITIES: [],
      ASSETS: [],
      INCOME: [],
      EXPENSES: [],
      ALL: [],
    }
    const org = store.get('selectedOrg')
    const result = await ChartOfAccService.ChartOfAllAcount(org.orgCode)
    if (result && result.length) {
      const csvDataVal = HelperFunction.getDataForCSV(result, tableAllColumns)
      setCSVData(csvDataVal)
      const resultData = JSON.parse(JSON.stringify(result))
      resultData.forEach(element => {
        if (element.natureofaccount === 'LIABILITIES') {
          obj.LIABILITIES.push(element)
        } else if (element.natureofaccount === 'ASSETS') {
          obj.ASSETS.push(element)
        } else if (element.natureofaccount === 'INCOME') {
          obj.INCOME.push(element)
        } else if (element.natureofaccount === 'EXPENSES') {
          obj.EXPENSES.push(element)
        }
      })

      obj.ALL = result

      if (obj?.ALL?.length) {
        obj.ALL.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      if (obj?.LIABILITIES?.length) {
        obj.LIABILITIES.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      if (obj?.ASSETS?.length) {
        obj.ASSETS.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      if (obj?.INCOME?.length) {
        obj.INCOME.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      if (obj?.EXPENSES?.length) {
        obj.EXPENSES.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getAccountsObj(obj || {})
    } else {
      setCSVData([])
      getAccountsObj({})
    }
  }

  const passDataToMoad = (record, val) => {
    // console.log(record, 'record')
    showModal()
    getChartData(record)
    setAddEdit(val)
  }
  const showModal = () => {
    setAddEdit(true)
    setIsModalVisible(true)
    getChartData([])
  }

  const handleOk = val => {
    // console.log(val, 'val')
    if (val) {
      fetchData()
    }
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  // console.log(routerData, 'router')
  const { ALL, LIABILITIES, ASSETS, INCOME, EXPENSES } = accountsObj
  return (
    <div>
      <div className="text-end mb-3">
        {/* <div>
          <div>Options</div>
        </div> */}
        <Button color="secondary" className="me-2 mb-2">
          <Dropdown
            trigger={["click"]}
            popupRender={() => <ExportOptions
                handleRecieptModal={() => setShownReciept(!isShownReciept)}
                csvData={csvData}
                apiData={ALL}
                columns={tableAllColumns}
                fileName="Account List"
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
          <strong>Print</strong>
        </Button> */}
        <Button
          type="primary"
          onClick={showModal}
          size="medium"
          className="text-center"
          htmlType="submit"
        >
          {/* <strong>
            {' '}
            <Link
              to="/accounts/chart-of-account/create"
              className="text-white"
            >
              Create {routeName}
            </Link>
          </strong> */}
          Add Account
        </Button>
      </div>
      <Tabs defaultActiveKey="1" className="antd__tab--content">
        <TabPane tab={`All Accounts (${ALL ? ALL.length : 0})`} key="1">
          {/* <Table rowKey="id" columns={tableColumns} dataSource={quotations} pagination={false} /> */}
          {/* <Table
            id="table__layout--css"
            rowKey="id"
            columns={tableAllColumns}
            dataSource={ALL || []}
            pagination
            showSorterTooltip={false}
          /> */}
          <div className="ag-theme-alpine agggrid--table__container">
            <AgGridReact
              theme={"legacy"}
              rowData={ALL || []}
              columnDefs={singleLevelColumn(tableAllColumns)}
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
        <TabPane tab={`ASSETS (${ASSETS ? ASSETS.length : 0})`} key="2">
          {/* <Table
            id="table__layout--css"
            rowKey="id"
            columns={tableColumns}
            dataSource={ASSETS || []}
            pagination
            showSorterTooltip={false}
          /> */}
          <div className="ag-theme-alpine agggrid--table__container">
            <AgGridReact
              theme={"legacy"}
              rowData={ASSETS || []}
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
        <TabPane tab={`LIABILITIES (${LIABILITIES ? LIABILITIES.length : 0})`} key="3">
          {/* <Table
            id="table__layout--css"
            rowKey="id"
            columns={tableColumns}
            dataSource={LIABILITIES || []}
            pagination
            showSorterTooltip={false}
          /> */}
          <div className="ag-theme-alpine agggrid--table__container">
            <AgGridReact
              theme={"legacy"}
              rowData={LIABILITIES || []}
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
        <TabPane tab={`REVENUE (${INCOME ? INCOME.length : 0})`} key="4">
          {/* <Table
            id="table__layout--css"
            rowKey="id"
            columns={tableColumns}
            dataSource={INCOME || []}
            pagination
            showSorterTooltip={false}
          /> */}
          <div className="ag-theme-alpine agggrid--table__container">
            <AgGridReact
              theme={"legacy"}
              rowData={INCOME || []}
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
        <TabPane tab={`EXPENSES (${EXPENSES ? EXPENSES.length : 0})`} key="5">
          {/* <Table
            id="table__layout--css"
            rowKey="id"
            columns={tableColumns}
            dataSource={EXPENSES}
            pagination
            showSorterTooltip={false}
          /> */}
          <div className="ag-theme-alpine agggrid--table__container">
            <AgGridReact
              theme={"legacy"}
              rowData={EXPENSES || []}
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
      </Tabs>
      {isModalVisible && (
        <Modal
          className="chart-of-account"
          title="Add Account"
          footer={null}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <CreateChartOfAccount showModal={handleOk} chartData={chartData} isAddEdit={addEdit} />
        </Modal>
      )}
      {/* {isModalVisible && (
        <Modal
          className="chart-of-account"
          title="Create New Group"
          footer={null}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <CreateAccountGroup showModal={handleOk} chartData={chartData} isAddEdit={addEdit} />
        </Modal>
      )} */}
      <OtherPrimaryReport
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={ALL || []}
        salesValue="Chart Of Accounts"
        flag="ChartOfAccounts"
        // dateValue={"dateValue"}
      />
    </div>
  )
}

export default connect()(ChartOfAccountList)

