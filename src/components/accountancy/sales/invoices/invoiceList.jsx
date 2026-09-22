import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Tabs, Modal, Upload, message, Dropdown, Input } from 'antd'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import { UploadOutlined, DownOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { AgGridReact } from 'ag-grid-react'
import { connect } from 'react-redux'
import store from 'store'
import QuotationService from '@/services/sales'
import ReceiptPrint from '@/components/accountancy/common/receipt'
import HelperFunction from '@/services/helper'
import moment from 'moment'
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

const InvoiceList = routerData => {
  const location = useLocation()
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [page, setpage] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  const [baseData, setBaseData] = useState([])
  const [gridApi, setGridApi] = useState()

  const tableColumns = [
    ...SalesColumns.SalesInvoiceCols,
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      cellRenderer: params => {
        const dt = params?.data
        const poNumber = dt && dt.invoiceno
        return (
          <span>
            <Link to={`/sales/invoice/${poNumber}`}>
              <span className="viewIcon">
                <EyeOutlined />
              </span>
            </Link>
            {dt.accepted === 'APPROVE' && <Link to={`/sales/invoice/${poNumber}`}> | Pay</Link>}
          </span>
        )
      },
    },
  ]

  useEffect(() => {
    const quoteData = {
      accepted: [],
      sent: [],
      draft: [],
      approved: [],
      declined: [],
    }

    const fetchData = async () => {
      const org = store.get('selectedOrg')
      const result = await QuotationService.invoiceList(org.orgCode)
      // console.log(result, 'ress111')
      if (result && result.length) {
        const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
        setCSVData(csvDataVal)
        const resultData = JSON.parse(JSON.stringify(result))

        resultData.forEach(item => {
          item.estimateDate = new Date(item.estimateDate)
          // console.log(item, 'items')
          if (item.status === 'ACCEPTED') {
            quoteData.accepted.push(item)
          } else if (item.status === 'DECLIENED') {
            quoteData.declined.push(item)
          } else if (item.status === 'SENT') {
            quoteData.sent.push(item)
          } else if (item.status === 'APPROVE') {
            quoteData.approved.push(item)
          } else {
            quoteData.draft.push(item)
          }
        })

        if (result.length) {
          result.forEach((ele, i) => {
            ele.key = i + 1
          })

          if (quoteData?.accepted?.length) {
            quoteData.accepted.forEach((ele, i) => {
              ele.key = i + 1
            })
          }

          if (quoteData?.declined?.length) {
            quoteData.declined.forEach((ele, i) => {
              ele.key = i + 1
            })
          }

          if (quoteData?.approved?.length) {
            quoteData.approved.forEach((ele, i) => {
              ele.key = i + 1
            })
          }

          if (quoteData?.draft?.length) {
            quoteData.draft.forEach((ele, i) => {
              ele.key = i + 1
            })
          }
        }

        getQuotations(result)
        setBaseData(result)

        getQuotationsList(quoteData)
      } else {
        setCSVData([])
        getQuotations([])
        getQuotationsList(quoteData)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBulkUpload = () => {
    // console.log('handleBulkUpload')
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const propsData = {
    name: 'file',
    action: 'https://103.8.167.194:8090/isees/api/purchaseOrder/saveBulkFiles',
    headers: {
      // authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
        handleCancel(false)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  const onHandleChange = (e, value) => {
    // console.log(e.target.value, value)
  }

  const search = value => {
    const quoteData = {
      accepted: [],
      sent: [],
      draft: [],
      approved: [],
      declined: [],
    }

    const filterTableVal = baseData.filter(o =>
      Object.keys(o).some(k =>
        String(o[k])
          .toLowerCase()
          .includes(value.toLowerCase()),
      ),
    )
    const resultData = JSON.parse(JSON.stringify(filterTableVal))

    resultData.forEach(item => {
      item.estimateDate = new Date(item.estimateDate)
      // console.log(item, 'items')
      if (item.status === 'ACCEPTED') {
        quoteData.accepted.push(item)
      } else if (item.status === 'DECLIENED') {
        quoteData.declined.push(item)
      } else if (item.status === 'SENT') {
        quoteData.sent.push(item)
      } else if (item.status === 'APPROVE') {
        quoteData.approved.push(item)
      } else {
        quoteData.draft.push(item)
      }
    })

    if (filterTableVal.length) {
      filterTableVal.forEach((ele, i) => {
        ele.key = i + 1
      })

      if (quoteData?.accepted?.length) {
        quoteData.accepted.forEach((ele, i) => {
          ele.key = i + 1
        })
      }

      if (quoteData?.declined?.length) {
        quoteData.declined.forEach((ele, i) => {
          ele.key = i + 1
        })
      }

      if (quoteData?.approved?.length) {
        quoteData.approved.forEach((ele, i) => {
          ele.key = i + 1
        })
      }

      if (quoteData?.draft?.length) {
        quoteData.draft.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
    }

    getQuotations(filterTableVal)
    getQuotationsList(quoteData)
  }

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

  // console.log(routerData, 'router')
  const routeName = location?.pathname.split('/')[2]
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
              popupRender={() =>  <ExportOptions
                  handleRecieptModal={() => setShownReciept(!isShownReciept)}
                  csvData={csvData}
                  apiData={quotations}
                  columns={tableColumns}
                  fileName="Sales Invoice List"
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
            outline
            className="me-2 mb-2"
            size="large"
            onClick={() => setShownReciept(!isShownReciept)}
          >
            <strong>Print</strong>
          </Button> */}
          {/* <Button
          type="primary"
          size="large"
          className="text-center w-10 mb-1"
          htmlType="submit"
          onClick={showModal}
        >
          <strong>Bulk Invoice</strong>
          </Button> */}{' '}
          &nbsp;
          <Button type="primary" size="medium" className="text-center w-10 mb-1" htmlType="submit">
            <Link
              to={`/sales/${routeName.substring(0, routeName.length - 1)}/create`}
              className="text-white"
            >
              Create {routeName}
            </Link>
          </Button>
        </div>
      </div>
      <Tabs defaultActiveKey="1" className="antd__tab--content">
        <TabPane
          tab={`All (${quotations ? quotations.length : 0})`}
          key="1"
          className="ag-theme-alpine agggrid--table__container"
        >
          {/* <Table
            id="table__layout--css"
            rowKey="id"
            columns={tableColumns}
            dataSource={quotations}
            pagination
            showSorterTooltip={false}
          /> */}
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
        </TabPane>
        <TabPane
          tab={`Draft (${draft ? draft.length : 0})`}
          key="2"
          className="ag-theme-alpine agggrid--table__container"
        >
          {/* <Table
            id="table__layout--css"
            rowKey="id"
            columns={tableColumns}
            dataSource={draft}
            pagination
            showSorterTooltip={false}
          /> */}
          <AgGridReact
            theme={"legacy"}

            rowData={draft}
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
        </TabPane>
        <TabPane
          tab={`Sent (${sent ? sent.length : 0})`}
          key="3"
          className="ag-theme-alpine agggrid--table__container"
        >
          {/* <Table
            id="table__layout--css"
            rowKey="id"
            columns={tableColumns}
            dataSource={sent}
            pagination
            showSorterTooltip={false}
          /> */}
          <AgGridReact
            theme={"legacy"}

            rowData={sent}
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
        </TabPane>
        <TabPane
          tab={`Declined (${declined ? declined.length : 0})`}
          key="4"
          className="ag-theme-alpine agggrid--table__container"
        >
          {/* <Table
            id="table__layout--css"
            rowKey="id"
            columns={tableColumns}
            dataSource={declined}
            pagination
            showSorterTooltip={false}
          /> */}
          <AgGridReact
            theme={"legacy"}

            rowData={declined}
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
        </TabPane>
        <TabPane
          tab={`Accepted (${accepted ? accepted.length : 0})`}
          key="5"
          className="ag-theme-alpine agggrid--table__container"
        >
          {/* <Table
            id="table__layout--css"
            rowKey="id"
            columns={tableColumns}
            dataSource={accepted}
            pagination
            showSorterTooltip={false}
          /> */}
          <AgGridReact
            theme={"legacy"}

            rowData={accepted}
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
        </TabPane>
        <TabPane
          tab={`Approved (${approved ? approved.length : 0})`}
          key="6"
          className="ag-theme-alpine agggrid--table__container"
        >
          {/* <Table
            id="table__layout--css"
            rowKey="id"
            columns={tableColumns}
            dataSource={approved}
            pagination={false}
          /> */}
          <AgGridReact
            theme={"legacy"}

            rowData={approved}
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
        </TabPane>
      </Tabs>
      <OtherPrimaryReport
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={quotations || []}
        salesValue="Sales Invoice"
        flag="SalesInvoiceList"
        // dateValue={"dateValue"}
      />
      {/* <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={quotations || []}
        salesValue="Sales Invoice"
        flag="Sales List"
      /> */}

      {isModalVisible && (
        <Modal
          title="Bulk Upload"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Upload {...propsData}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Modal>
      )}
    </div>
  )
}

export default connect()(InvoiceList)
