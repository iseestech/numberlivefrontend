import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Dropdown, Tabs, Input, Form, message, Modal } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import { DownOutlined, ReloadOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import { AgGridReact } from 'ag-grid-react'
import store from 'store'
import { connect } from 'react-redux'
import QuotationService from '@/services/sales'
import ReceiptPrint from '@/components/accountancy/common/receipt'
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

const tableColumns = [
  ...SalesColumns.salesOrdersCols,
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    className: 'actionCol',
    filter: false,
    cellRenderer: params => {
      const dt = params?.data
      const poNumber = dt && dt.orderno
      return (
        <Link to={`/sales/order/${poNumber}`}>
          <span className="viewIcon">
            <EyeOutlined />
          </span>
        </Link>
      )
    },
  },
]

const OrderList = () => {
  const location = useLocation()
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [page, setpage] = useState(1)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  const [baseData, setBaseData] = useState([])
  const [gridApi, setGridApi] = useState()

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
      const result = await QuotationService.orderList(org.orgCode)
      // console.log(result, 'ress111')
      if (result && result.length) {
        const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
        setCSVData(csvDataVal)
        const resultData = JSON.parse(JSON.stringify(result))
        resultData.forEach(item => {
          // console.log(item, 'items')
          if (item.status === 'ACCEPTED') {
            quoteData.accepted.push(item)
          } else if (item.status === 'DECLINED') {
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
            // console.log(ele,"ele")
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

        // console.log(result, 'result')
        getQuotations(result)
        getQuotationsList(quoteData)
        setBaseData(result)
      } else {
        setCSVData([])
        getQuotations([])
        getQuotationsList(quoteData)
      }
    }

    fetchData()
  }, [page])

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
  const routeName = location.pathname.split('/')[2]

  const { accepted, sent, draft, approved, declined } = quotationList

  const selectTableCols = [
    {
      title: 'Sales Order No',
      dataIndex: 'orderno',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customername',
    },
    {
      title: 'Amount',
      dataIndex: 'total',
    },
    {
      title: 'Action',
      render: (text, record) => {
        return (
          <Button onClick={() => convertToInvoice(text)} type="primary" htmlType="submit">
            Convert
          </Button>
        )
      },
    },
  ]

  const [selectArray, setSelectArray] = useState([])
  const [selectPiModal, setSelectPiModal] = useState(false)

  const convertToInvoice = text => {
    const data = `customerId=${text.customerId}&orderId=${text.orderno}&status=APPROVE`
    const fetchData = async () => {
      const result = await QuotationService.convertToInvoice(data, 'get')
      console.log(result)
      if (result && result?.statusCode === 200) {
        message.success(`Successfully converted to Invoice`)
        // delete row
        setSelectArray(prev => {
          return prev.filter(entry => entry.quote_number !== text.quote_number)
        })
      }
    }
    fetchData()
  }
  const rowSelectionType = 'multiple'
  // function will trigger once selection changed
  const onSelectionChanged = event => {
    setSelectArray(event.api.getSelectedRows())
  }
  const isRowSelectable = params => {
    return !!params.data && params.data.status === 'ACCEPTED'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-4">
        <div>
          <Input.Search allowClear placeholder="Search by..." enterButton onSearch={search} />
        </div>
        {selectArray.length > 0 && (
          <Button
            type="primary"
            size="medium"
            className="text-center w-10 mb-1"
            style={{ marginLeft: '3px' }}
            htmlType="submit"
            onClick={() => {
              setSelectPiModal(true)
            }}
          >
            Convert To Invoice
          </Button>
        )}
        <div className="text-end">
          <Button color="secondary" className="me-2 mb-2">
            <Dropdown
              trigger={["click"]}
              popupRender={ () => <ExportOptions
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
            rowSelection={rowSelectionType}
            onSelectionChanged={onSelectionChanged}
            isRowSelectable={isRowSelectable}
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
            pagination
            showSorterTooltip={false}
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
        salesValue="Sales Order"
        flag="SalesOrder"
        // dateValue={"dateValue"}
      />
      {/* <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={quotations || []}
        salesValue="Sales Order"
        flag="Sales List"
      /> */}

      {selectPiModal && (
        <Modal
          title={null}
          centered
          open="true"
          onOk={() => {
            setSelectPiModal(false)
            setpage(pre => pre + 1)
          }}
          onCancel={() => {
            setSelectPiModal(false)
            setpage(pre => pre + 1)
          }}
          footer={null}
          width={800}
        >
          <Table columns={selectTableCols} dataSource={selectArray} pagination={{ pageSize: 6 }} />
        </Modal>
      )}
    </div>
  )
}

export default connect()(OrderList)
