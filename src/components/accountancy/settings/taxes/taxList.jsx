import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Modal } from 'antd'
import { Link } from 'react-router-dom'
import ProductAndServices from '@/components/accountancy/JSON/ProductAndServices.json'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import TaxService from '@/services/settings'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import apiClient from '@/services/axios'
import tableData from './data.json'
import CreateTax from './createTax'

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const tableColumns = [
  ...ProductAndServices.taxList,
  {
    title: 'Actions',
    key: 'actions',
    className: 'actionCol',
    cellRenderer: params => {
      const dt = params?.data
      return (
        <Link to={`/settings/tax/${dt.id}`}>
          <span className="editIcon">
            <EditOutlined />
          </span>
        </Link>
      )
    },
  },
]

const TaxList = routerData => {
  const [customers, getCustomers] = useState([])
  const [page, setpage] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  const [gridApi, setGridApi] = useState()

  const fetchData = async () => {
    const result = await TaxService.taxList()
    if (result.length) {
      result.forEach((ele, i) => {
        ele.key = i + 1
      })
    }
    getCustomers(result)
  }
  useEffect(() => {
    fetchData()
  }, [page])

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = value => {
    if (value) {
      fetchData()
    }
    setIsModalVisible(false)
  }

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  // console.log(customers, 'customers')
  // const routeName = routerData.match.path.split('/')[2]
  // console.log(CustomerService.customerList())
  return (
    <div>
      <div className="text-end mb-4">
        <Button
          type="primary"
          onClick={showModal}
          size="medium"
          className="text-center w-10 mb-1"
          htmlType="submit"
        >
          Create Tax
        </Button>
      </div>
      {/* <Table
        id="table__layout--css"
        rowKey="id"
        columns={tableColumns}
        dataSource={customers}
        pagination={false}
      /> */}
      <div className="ag-theme-alpine agggrid--table__container">
        <AgGridReact
           theme="legacy"
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
      {isModalVisible && (
        <Modal
          title="Create Tax"
          footer={null}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          className="productPropsModal"
        >
          <CreateTax onCancel={handleCancel} />
        </Modal>
      )}
      <OtherPrimaryReport
        open={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={[] || []}
        salesValue="Chart Of Accounts"
        flag="ChartOfAccounts"
        // dateValue={"dateValue"}
      />
    </div>
  )
}

export default connect()(TaxList)
