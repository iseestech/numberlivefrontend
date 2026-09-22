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
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Customer Name',
    dataIndex: 'customerName',
    key: 'customerName',
  },
  {
    title: 'Project Name',
    dataIndex: 'projectName',
    key: 'projectName',
  },
  {
    title: 'Billing Method',
    dataIndex: 'billingMethod',
    key: 'billingMethod',
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    render: (text, record) => {
      // console.log(text, record)
      return <Link to={`/project/${record.id}`}>click here</Link>
    },
  },
]

const ProjectList = routerData => {
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
      const result = await PurchaseService.purchaseOrderList()
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
        <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
          <strong>
            {' '}
            <Link to="/project/create" className="text-white">
              Create
            </Link>
          </strong>
        </Button>
      </div>
      <Table
        rowKey="purchase_id"
        columns={tableColumns}
        dataSource={tableData}
        pagination={false}
      />
    </div>
  )
}

export default connect()(ProjectList)

