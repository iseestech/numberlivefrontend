import React, { useState, useEffect } from 'react'
import { Button, Table, Tabs, Select } from 'antd'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PhysicalStocsService from '@/services/physicalStocks'
import tableData from './data.json'

const { Option } = Select
const { TabPane } = Tabs

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const tableColumns = [
  {
    title: 'Stock#',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Reference',
    dataIndex: 'reference',
    key: 'reference',
  },
  {
    title: 'Customer',
    dataIndex: 'firstName',
    key: 'firstName',
  },
  {
    title: 'Date',
    dataIndex: 'estimateDate',
    key: 'estimateDate',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  // {
  //   title: 'Actions',
  //   dataIndex: 'actions',
  //   key: 'actions',
  //   render: (text, record) => {
  //     // console.log(text, record)
  //     return <Link to={`/inventory/stock/${record.id}`}>click here</Link>
  //   },
  // },
]

const tableColumnsNew = [
  {
    title: 'Stock#',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Product#',
    dataIndex: 'phyStockDate',
    key: 'phyStockDate',
  },
  {
    title: 'Product Name',
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: 'System Stock',
    dataIndex: 'systemStock',
    key: 'systemStock',
  },
  {
    title: 'Physical Stock',
    dataIndex: 'physicalStock',
    key: 'physicalStock',
  },
  {
    title: 'Differance(sys - phy)',
    dataIndex: 'difference',
    key: 'difference',
  },
]

const PhysicalStockList = routerData => {
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [customers, getCustomers] = useState([])
  const [page, setpage] = useState(1)

  useEffect(() => {
    const fetchData = async id => {
      const result = await PhysicalStocsService.physicalStocksList()
      // console.log(result, 'ress')
      // if (result && result.lenght) {
      getQuotations(result)
      // } else {
      //   getQuotations([])
      // }
    }
    fetchData()
    // fetchCustData()
  }, [page])

  // console.log(routerData, 'router')
  const routeName = routerData.match.path.split('/')[2]
  return (
    <div>
      <div className="text-end">
        <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
          <strong>
            {' '}
            <Link
              to={`/inventory/${routeName.substring(0, routeName.length - 1)}/create`}
              className="text-white"
            >
              Create {routeName}
            </Link>
          </strong>
        </Button>

        <hr />
      </div>
      <Table
        rowKey="id"
        columns={tableColumnsNew}
        dataSource={quotations}
        pagination
        showSorterTooltip={false}
      />
    </div>
  )
}

export default connect()(PhysicalStockList)

