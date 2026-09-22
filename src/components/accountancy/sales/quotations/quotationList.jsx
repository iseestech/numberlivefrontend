import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Dropdown, Tabs, Input, Modal, message, Form } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import store from 'store'
import QuotationService from '@/services/sales'
import HelperFunction from '@/services/helper'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import { DownOutlined, EyeOutlined } from '@ant-design/icons'
import { AgGridReact } from 'ag-grid-react'
import SalesColumns from '@/components/accountancy/JSON/SalesColumnNew'

import singleLevelColumn, {
  agGridDefaultColDef,
  agGridautoGroupColumnDef,
  agGridStatusBar,
  agGetContextMenuItems,
} from '../aggrid/singleLevelColumn'

const { TabPane } = Tabs

console.log(SalesColumns)
const mapStateToProps = ({ router }) => ({
  routerData: router,
})
const tableColumns = [
  ...SalesColumns.salesQuotesCols.map(ele => {
    if (ele.dataIndex === 'key') {
      return {
        ...ele,
        checkboxSelection: params => {
          return !!params.data && params.data.accept_status === 'ACCEPTED'
        },
      }
    }
    return ele
  }),
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    filter: false,
    cellRenderer: params => {
      const dt = params?.data
      const poNumber = dt && dt.quote_number
      // put the value in bold
      return (
        <Link to={`/sales/quotation/${poNumber}`}>
          <span className="viewIcon">
            <EyeOutlined />
          </span>
        </Link>
      )
    },
  },
]

const QuotationList = () => {
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
      invoiced: [],
      declined: [],
      approved: [],
    }

    const fetchData = async () => {
      const org = store.get('selectedOrg')
      const result = await QuotationService.quotationList(org.orgCode)
      if (result && result.length) {
        const csvDataVal = HelperFunction.getDataForCSV(result, tableColumns)
        setCSVData(csvDataVal)
        const resultData = JSON.parse(JSON.stringify(result))

        resultData.forEach(item => {
          if (item.accept_status === 'ACCEPTED') {
            quoteData.accepted.push(item)
          } else if (item.accept_status === 'DECLIEND') {
            quoteData.declined.push(item)
          } else if (item.accept_status === 'SENT') {
            quoteData.sent.push(item)
          } else if (item.accept_status === 'APPROVE') {
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
      if (item.accept_status === 'ACCEPTED') {
        quoteData.accepted.push(item)
      } else if (item.accept_status === 'DECLIENED') {
        quoteData.declined.push(item)
      } else if (item.accept_status === 'SENT') {
        quoteData.sent.push(item)
      } else if (item.accept_status === 'APPROVE') {
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
  // const getContextMenuItems = useCallback(params => {
  //   console.log(params, 'useCallback')
  //   return [...params.defaultItems, 'chartRange']
  // }, [])

  const chartToolPanelsDef = {
    settingsPanel: {
      chartGroupsDef: {
        columnGroup: ['column', 'stackedColumn', 'normalizedColumn'],
        barGroup: ['bar', 'stackedBar', 'normalizedBar'],
        pieGroup: ['pie', 'doughnut'],
        lineGroup: ['line'],
        scatterGroup: ['scatter', 'bubble'],
        areaGroup: ['area', 'stackedArea', 'normalizedArea'],
        histogramGroup: ['histogram'],
        combinationGroup: ['columnLineCombo', 'areaColumnCombo', 'customCombo'],
      },
    },
  }
  // bulk selection
  const [selectArray, setSelectArray] = useState([])
  const rowSelectionType = 'multiple'
  const onSelectionChanged = event => {
    setSelectArray(event.api.getSelectedRows())
  }
  const isRowSelectable = params => {
    return !!params.data && params.data.accept_status === 'ACCEPTED'
  }
  const [convertModal, setConvertModal] = useState(false)

  const convertModalCols = [
    {
      title: 'Customer Name',
      dataIndex: 'customername',
    },
    {
      title: 'Quote#',
      dataIndex: 'quote_number',
    },
    {
      title: 'Action',
      render: (text, record) => {
        return (
          <Button onClick={() => convertToOrder(text)} type="primary" htmlType="submit">
            Convert
          </Button>
        )
      },
    },
  ]

  const convertToOrder = text => {
    const data = `customerId=${text.customer_id}&quoteId=${text.quote_number}&status=APPROVE`
    const fetchData = async () => {
      const result = await QuotationService.convertToOrder(data, 'get')
      console.log(result)
      if (result && result?.statusCode === 200) {
        message.success(`Successfully converted to Order`)
        // delete row
        setSelectArray(prev => {
          return prev.filter(entry => entry.quote_number !== text.quote_number)
        })
      }
    }
    fetchData()
  }

  const routeName = location.pathname.split('/')[2]
  const { accepted, sent, draft, approved, declined } = quotationList
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-4">
        <div>
          <Input.Search allowClear placeholder="Search by..." enterButton onSearch={search} />
        </div>
        <div className="text-end">
          {selectArray.length > 0 && (
            <Button
              type="primary"
              size="medium"
              className="text-center w-10 mb-1"
              style={{ marginLeft: '3px' }}
              htmlType="submit"
              onClick={() => setConvertModal(true)}
            >
              Convert To Order
            </Button>
          )}
          <Button color="secondary" className="me-2 mb-2">
            <Dropdown
            trigger={["click"]}
              popupRender={ () =>  <ExportOptions
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
        salesValue="Sales Quote"
        flag="SalesQuotation"
        // dateValue={"dateValue"}
      />
      {convertModal && (
        <Modal
          title={null}
          centered
          open="true"
          onOk={() => {
            setConvertModal(false)
            setpage(pre => pre + 1)
          }}
          onCancel={() => {
            setConvertModal(false)
            setpage(pre => pre + 1)
          }}
          footer={null}
          width={600}
        >
          <Table columns={convertModalCols} dataSource={selectArray} pagination={{ pageSize: 6 }} />
        </Modal>
      )}
    </div>
  )
}

export default connect()(QuotationList)
