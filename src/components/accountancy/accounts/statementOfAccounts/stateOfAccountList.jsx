import React, { useState, useEffect } from 'react'
import { Button, Table, Tabs } from 'antd'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PurchaseService from '@/services/purchase'
import tableData from './data.json'
import './index.scss'

const { TabPane } = Tabs

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const tableColumns = [
  {
    title: 'Account',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Account Code',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'total',
    dataIndex: 'total',
    key: 'total',
  },
  // {
  //   title: 'Actions',
  //   dataIndex: 'actions',
  //   key: 'actions',
  //   render: (text, record) => {
  //     // console.log(text, record)
  //     return <Link to={`/purchase/order/${record.purchase_id}`}>click here</Link>
  //   },
  // },
]

const StateOfAccountList = routerData => {
  // console.log(routerData, 'router')
  const routeName = routerData.match.path.split('/')[2]
  // const { accepted, sent, draft, invoiced, declined } = quotationList
  return (
    <div>
      <div className="sub-header__section">
        {/* <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
          <strong>
            {' '}
            <Link
              to="/expenses/create"
              className="text-white"
            >
              Create {routeName}
            </Link>
          </strong>
        </Button> */}
        <div>This Month</div>
        <div>Print</div>
      </div>
      <div className="report__section">
        <div className="top__section">
          <span>Self</span>
          <span>
            <strong>Statement Of Accounts</strong>
          </span>
          <span>Basis: Accrual</span>
          <span>As of 16/01/2021</span>
        </div>
        <div className="report__content">
          <div className="text-end">Add Temporary Note</div>
          <Table
            rowKey="purchase_id"
            columns={tableColumns}
            dataSource={tableData}
            pagination={false}
          />
        </div>
      </div>
    </div>
  )
}

export default connect()(StateOfAccountList)

