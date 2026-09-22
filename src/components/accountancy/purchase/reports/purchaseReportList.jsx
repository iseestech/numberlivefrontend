import HelperFunction from '@/services/helper'

import React, { useState, useEffect } from 'react'
import { Button, Table, Tabs } from 'antd'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PurchaseService from '@/services/purchase'
import tableData from './data.json'

const { TabPane } = Tabs

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const tableColumns = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    // render: (text, record, index) => index + 1,
  },
  {
    title: 'Invoice#',
    dataIndex: 'invoiceNo',
    key: 'invoiceNo',
  },
  {
    title: 'Reference',
    dataIndex: 'reference',
    key: 'reference',
  },
  {
    title: 'Vendor Id',
    dataIndex: 'customerId',
    key: 'customerId',
  },
  {
    title: 'Purchase Date',
    dataIndex: 'estimateDate',
    key: 'estimateDate',
  },
  // {
  //   title: 'Delivery Date',
  //   dataIndex: 'expiry_date',
  //   key: 'expiry_date',
  // },
  // {
  //   title: 'Order No',
  //   dataIndex: 'order_no',
  //   key: 'order_no',
  // },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    isCustCellRender: true,
    cellRenderer: HelperFunction.renderCellAmt,
  },
  // {
  //   title: 'Actions',
  //   dataIndex: 'actions',
  //   key: 'actions',
  //   render: (text, record) => {
  //     // console.log(text, record)
  //     return <Link to={`/purchase/invoice/${record.id}`}>click here</Link>
  //   },
  // },
]

const PurchaseReportList = routerData => {
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [page, setpage] = useState(1)
  useEffect(() => {
    const quoteData = {
      accepted: [],
      sent: [],
      draft: [],
      invoiced: [],
      declined: [],
    }

    const fetchData = async () => {
      const result = await PurchaseService.purchaseInvoiceList()
      // console.log(result, 'ress111')
      if (result && result.data.length) {
        result.data.forEach(item => {
          // console.log(item, 'items')
          if (item.status === 'accepted') {
            quoteData.accepted.push(item)
          } else if (item.status === 'declined') {
            quoteData.declined.push(item)
          } else if (item.status === 'sent') {
            quoteData.sent.push(item)
          } else if (item.status === 'invoiced') {
            quoteData.invoiced.push(item)
          } else {
            quoteData.draft.push(item)
          }
        })
        if (result.length) {
          result.forEach((ele, i) => {
            ele.key = i + 1
          })
        }
        getQuotations(result.data)
        getQuotationsList(quoteData)
      } else {
        getQuotations([])
        getQuotationsList(quoteData)
      }
    }

    fetchData()
  }, [page])

  // console.log(routerData, 'router')
  const routeName = routerData.match.path.split('/')[2]
  // const { accepted, sent, draft, invoiced, declined } = quotationList
  return (
    <div>
      <div className="text-end">
        {/* <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
          <strong>
            {' '}
            <Link
              to={`/purchase/${routeName.substring(0, routeName.length - 1)}/create`}
              className="text-white"
            >
              Create {routeName}
            </Link>
          </strong>
        </Button> */}
      </div>
      <Table
        rowKey="id"
        columns={tableColumns}
        dataSource={quotations}
        pagination
        showSorterTooltip={false}
      />

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
    </div>
  )
}

export default connect()(PurchaseReportList)
