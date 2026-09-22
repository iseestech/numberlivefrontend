import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Modal, Tabs } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import ProductAndServices from '@/components/accountancy/JSON/ProductAndServices.json'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import ProductsService from '@/services/products'
import apiClient from '@/services/axios'
import tableData from './data.json'
import CreateUnit from './createUnit'

const { TabPane } = Tabs

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const UnitList = routerData => {
  const [productCategory, getProductCategory] = useState([])
  const [productGroup, getProductGroup] = useState([])
  const [productUnit, getProductUnit] = useState([])
  const [singleRecord, setSingleRecord] = useState({})
  const [action, setAction] = useState('Add')
  const [page, setpage] = useState(1)
  const [typeVal, setType] = useState('Group')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [gridApi, setGridApi] = useState()

  const catTableColumns = [
    ...ProductAndServices.category,
    {
      title: 'Actions',
      key: 'actions',
      className: 'actionCol',
      cellRenderer: params => {
        const dt = params?.data
        return (
          <Button
            type="button"
            onClick={() => getSingleRecord(dt)}
            style={{ background: 'none', border: 'none' }}
            className="p-0"
          >
            <span className="editIcon">
              <EditOutlined />
            </span>
          </Button>
        )
      },
    },
  ]

  const grpTableColumns = [
    ...ProductAndServices.groups,
    {
      title: 'Actions',
      key: 'actions',
      className: 'actionCol',
      cellRenderer: params => {
        const dt = params?.data
        return (
          <Button
            type="button"
            onClick={() => getSingleRecord(dt)}
            style={{ background: 'none', border: 'none' }}
            className="p-0"
          >
            <span className="editIcon">
              <EditOutlined />
            </span>
          </Button>
        )
      },
    },
  ]

  const unitTableColumns = [
    ...ProductAndServices.units,
    {
      title: 'Actions',
      key: 'actions',
      className: 'actionCol',
      cellRenderer: params => {
        const dt = params?.data
        return (
          <Button
            type="button"
            onClick={() => getSingleRecord(dt)}
            style={{ background: 'none', border: 'none' }}
            className="p-0"
          >
            <span className="editIcon">
              <EditOutlined />
            </span>
          </Button>
        )
      },
    },
  ]

  const getSingleRecord = record => {
    // console.log(record, 'record')
    setSingleRecord(record)
    setIsModalVisible(true)
    setAction('Update')
  }

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  const fetchData = async val => {
    const result = await ProductsService.productListCat(val)
    // console.log(result, 'result', val)
    // let type = typeVal
    if (val === 'Unit') {
      if (result?.data?.length) {
        result.data.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getProductUnit(result.data || [])
    } else if (val === 'Group') {
      if (result?.data?.length) {
        result.data.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getProductGroup(result.data || [])
    } else {
      if (result?.data?.length) {
        result.data.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getProductCategory(result.data || [])
    }
    setType(val)
  }

  useEffect(() => {
    fetchData(typeVal)
  }, [typeVal])

  const showModal = () => {
    console.log('ss')
    setIsModalVisible(true)
    setAction('Add')
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleTab = key => {
    // console.log(key, 'key')
    let val = 'Category'
    if (key === '1') {
      val = 'Category'
    } else if (key === '2') {
      val = 'Group'
    } else {
      val = 'Unit'
    }
    // console.log(val, 'val')
    fetchData(val)
    // setType(val)
  }

  const closeModal = val => {
    if (val) {
      fetchData(typeVal)
    }
    setIsModalVisible(false)
  }
  // console.log(customers, 'customers')
  // const routeName = routerData.match.path.split('/')[2]
  // console.log(CustomerService.customerList())
  return (
    <div>
      <Tabs defaultActiveKey="2" onChange={handleTab}>
        <TabPane tab="Group" key="2">
          <div className="text-end mb-4">
            <Button
              type="primary"
              onClick={showModal}
              size="medium"
              className="text-center w-10 mb-1"
              htmlType="submit"
            >
              Create Group
            </Button>
          </div>
          {/* <Table
            id="table__layout--css"
            rowKey="groupId"
            columns={grpTableColumns}
            dataSource={productGroup}
            // pagination={false}
            pagination
            showSorterTooltip={false}
          /> */}
          <div className="ag-theme-alpine agggrid--table__container">
            <AgGridReact
              theme="legacy"
              rowData={productGroup}
              columnDefs={singleLevelColumn(grpTableColumns)}
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
        <TabPane tab="Category" key="1">
          <div className="text-end mb-4">
            <Button
              type="primary"
              onClick={showModal}
              size="medium"
              className="text-center w-10 mb-1"
              htmlType="submit"
            >
              Create Category
            </Button>
          </div>
          {/* <Table
            id="table__layout--css"
            rowKey="catId"
            columns={catTableColumns}
            dataSource={productCategory}
            // pagination={false}
            pagination
            showSorterTooltip={false}
          /> */}
          <div className="ag-theme-alpine agggrid--table__container">
            <AgGridReact
             theme="legacy"
              rowData={productCategory}
              columnDefs={singleLevelColumn(catTableColumns)}
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
        <TabPane tab="Units" key="3">
          <div className="text-end mb-4">
            <Button
              type="primary"
              onClick={showModal}
              size="medium"
              className="text-center w-10 mb-1"
              htmlType="submit"
            >
              Create Units
            </Button>
          </div>
          {/* <Table
            id="table__layout--css"
            rowKey="unitId"
            columns={unitTableColumns}
            dataSource={productUnit}
            // pagination={false}
            pagination
            showSorterTooltip={false}
          /> */}
          <div className="ag-theme-alpine agggrid--table__container">
            <AgGridReact
             theme="legacy"
              rowData={productUnit}
              columnDefs={singleLevelColumn(unitTableColumns)}
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
      {console.log(isModalVisible, 'isModalVisible')}
      {/* <Table columns={tableColumns} dataSource={tableData} pagination={false} /> */}
      {isModalVisible && (
        <Modal
          title={`Create ${typeVal}`}
          footer={null}
          open={true}
          onOk={handleOk}
          onCancel={handleCancel}
          className="productPropsModal"
        >
          <CreateUnit
            type={typeVal}
            singleRecord={singleRecord}
            action={action}
            closeModal={closeModal}
            dataSource={productGroup}
          />
        </Modal>
      )}
    </div>
  )
}

export default connect()(UnitList)
