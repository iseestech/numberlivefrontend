import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Modal, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import CreateCostCenter from '@/pages/costCenter/createCostCenter'
import costCenter from '@/services/costCenter'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const CostCenterList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [centerData, setCenterData] = useState([])
  const [updateData, setUpdateData] = useState({})
  const [dataForDelete, setDataForDelete] = useState({})

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    setDeleteModal(false)
  }

  const handleCancel = value => {
    setIsModalVisible(false)
    setUpdateData(null)
    setDeleteModal(false)
    fetchList()
  }

  const colData = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'Id',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Center name',
      dataIndex: 'centerName',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'actionCol',
      cellRenderer: params => {
        const dt = params?.data
        return (
          <>
            <span className="editIcon">
              <EditOutlined
                onClick={() => {
                  setUpdateData({ id: dt.id, centerName: dt.centerName })
                  showModal()
                }}
              />
            </span>
            <span style={{ marginLeft: '12px' }}>
              <DeleteOutlined
                onClick={() => {
                  setDataForDelete({ id: dt.id, centerName: dt.centerName })
                  setDeleteModal(true)
                }}
              />
            </span>
          </>
        )
      },
    },
  ]

  async function DeleteCostCenter() {
    const id = Number(dataForDelete.id)
    const result = await costCenter.deleteCostCenter(id)
    if (result) {
      setDataForDelete(null)
      setDeleteModal(false)
      fetchList()
    }
  }

  async function fetchList() {
    const result = await costCenter.getRegion()
    if (result) {
      setCenterData(() => {
        return result.map((ele, i) => {
          return { ...ele, index: i + 1 }
        })
      })
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

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
          Create Cost Center
        </Button>
      </div>

      <div className="ag-theme-alpine agggrid--table__container">
        <AgGridReact
          theme={"legacy"}
          rowData={centerData}
          columnDefs={singleLevelColumn(colData)}
          defaultColDef={agGridDefaultColDef}
          autoGroupColumnDef={agGridautoGroupColumnDef}
          sideBar
          enableRangeSelection
          allowContextMenuWithControlKey
          getContextMenuItems={agGetContextMenuItems}
          //   onGridReady={onGridReady}
          statusBar={agGridStatusBar}
        />
      </div>

      {isModalVisible && (
        <Modal
          title={updateData?.centerName?.length > 0 ? 'Update Cost Center' : 'Create Cost Center'}
          footer={null}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          className="productPropsModal"
        >
          {updateData?.centerName?.length > 0 ? (
            <CreateCostCenter onCancel={handleCancel} updateData={updateData} actionType="Update" />
          ) : (
            <CreateCostCenter
              onCancel={handleCancel}
              actionType="Create"
              closeModal={handleCancel}
            />
          )}
        </Modal>
      )}

      {deleteModal && (
        <Modal
          title="Delete Cost Center"
          footer={null}
          open={deleteModal}
          onOk={handleOk}
          onCancel={handleCancel}
          className="productPropsModal"
        >
          <div>
            <Row className="form__body-content p-3 pb-0">
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    {/* id: {dataForDelete?.id} centerName: {dataForDelete?.centerName} */}
                    <h4>
                      Do you Want to Delete: <b>{dataForDelete?.centerName}</b>
                    </h4>
                  </Col>
                </Row>
              </Col>
            </Row>

            <div className="text-end p-3">
              <hr />
              <Button style={{ marginRight: '3px' }} type="default" onClick={() => handleCancel()}>
                Cencel
              </Button>
              <Button type="primary" onClick={() => DeleteCostCenter()}>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default CostCenterList

