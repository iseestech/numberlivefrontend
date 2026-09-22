import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Dropdown, Modal } from 'antd'
import {
  DownOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  TransactionOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import BankingCols from '@/components/accountancy/JSON/Banking'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import BankService from '@/services/banking'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import HelperFunction from '@/services/helper'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import store from 'store'

import apiClient from '@/services/axios'
import tableData from './data.json'
import AddBank from './addBank'

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const BankList = routerData => {
  const [customers, getCustomers] = useState([])
  const [page, setPage] = useState(1)
  const [recordData, setRecordData] = useState({ isEdit: false })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  const [gridApi, setGridApi] = useState()
  const { confirm } = Modal
  const tableColumns = [
    ...BankingCols.bankAcc,
    {
      title: 'Actions',
      key: 'actions',
      className: 'actionCol text-end',
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
            <Button
              onClick={() => {
                showModal()
                setRecordData({ isEdit: true, id: dt.id })
              }}
              className="p-0"
              style={{ border: 'none', background: 'none' }}
            >
              <Link to={`/banking/list/edit/${dt.id}`}>
                <span className="editIcon">
                  <EditOutlined />
                </span>
              </Link>
            </Button>
            <span>&nbsp; | </span>
            <Button className="p-0" style={{ border: 'none', background: 'none' }}>
              <Link to={`/banking/list/${dt.accountid}`}>
                <span className="transactionIcon ps-1">
                  <TransactionOutlined />
                </span>
              </Link>{' '}
            </Button>
            <span>&nbsp; | </span>

            <Button
              onClick={() => {
                // BankService.deleteActivity(dt.actname)
                // setTimeout(() => {
                //   fetchData()
                // }, 2000)
                confirm({
                  title: 'Do you Want to delete this item?',
                  content: '',
                  onOk() {
                    BankService.deleteActivity(dt.actname)
                    setTimeout(() => {
                      fetchData()
                    }, 2000)
                  },
                  onCancel() {
                    // console.log('Cancel')
                  },
                })
              }}
              className="p-0"
              style={{ border: 'none', background: 'none' }}
            >
              <span className="deleteIcon">
                <DeleteOutlined />
              </span>
            </Button>
          </div>
        )
      },
    },
  ]

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)

  const fetchData = async () => {
    const org = store.get('selectedOrg')
    const result = await BankService.bankList(org.orgCode)
    // console.log('result fetchData', result)
    const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
    if (result?.length) {
      result.forEach((ele, i) => {
        ele.key = i + 1
      })
    }
    setCSVData(result && result.length > 1 ? csvDataVal : [])
    getCustomers(result)
  }

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showModal = () => {
    setIsModalVisible(true)
    setRecordData({ isEdit: false })
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = isList => {
    if (isList) {
      fetchData()
    }
    setIsModalVisible(false)
  }

  // console.log(customers, 'customers')
  // const routeName = routerData.match.path.split('/')[2]
  // console.log(CustomerService.customerList())
  return (
    <div>
      <div className="text-end mb-3">
        {/* <Button color="secondary" className="me-2 mb-2">
          <Dropdown
            overlay={
              <ExportOptions
                handleRecieptModal={() => setShownReciept(!isShownReciept)}
                csvData={csvData}
                apiData={customers}
                columns={tableColumns}
                fileName="Bank List"
              />
            }
            className="me-2 mb-2"
          >
            <a className="ant-dropdown-link">
              In-Progress <DownOutlined />
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
        {/* <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
          <strong>Import</strong>
        </Button>
        <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
          <strong>Export</strong>
        </Button> */}
        <Button
          type="primary"
          onClick={showModal}
          size="medium"
          className="text-center w-10 mb-1"
          htmlType="submit"
        >
          {/* <strong>
            {' '}
            <Link
              to="/settings/tax/create"
              className="text-white"
            >
              Create {routeName}
            </Link>
          </strong> */}
          <Link
            to="/banking/list/add"
            // className="text-white"
          >
            Add Bank/Credit Card
          </Link>
        </Button>
      </div>
      {/* <Table
        id="table__layout--css"
        rowKey="id"
        columns={tableColumns}
        dataSource={customers}
        pagination
        showSorterTooltip={false}
      /> */}
      <div className="ag-theme-alpine agggrid--table__container">
        <AgGridReact
          theme={"legacy"}
          rowData={customers}
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
      {/* {isModalVisible && (
        <Modal
          title="Add Bank"
          footer={null}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <AddBank hideModal={handleCancel} recordData={recordData} />
        </Modal>
      )} */}
      <OtherPrimaryReport
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={customers || []}
        salesValue="Bank List"
        flag="BankList"
        // dateValue={"dateValue"}
      />
    </div>
  )
}

export default connect()(BankList)

