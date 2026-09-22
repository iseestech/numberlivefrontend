import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Menu, Dropdown, Table } from 'antd'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import InventoryService from '@/services/inventory'
import CreateNew from '@/components/accountancy/common/createNew'
import SendEmail from '@/components/accountancy/common/sendEmail'
import ReceiptPrint from '@/components/accountancy/common/receipt'
import { history } from '@/main'
// import CreateProductModal from './createProductModal'
import './index.scss'

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const columnData = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    render: (text, record, index) => index + 1,
  },
  // {
  //   title: 'Item',
  //   dataIndex: 'id',
  // },
  {
    title: 'Description',
    dataIndex: 'purchase_desc',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
  },
  {
    title: 'Unit Price',
    dataIndex: 'purchase_unit_price',
  },
  {
    title: 'Discount',
    dataIndex: 'purchase_discount',
  },
  {
    title: 'Account',
    dataIndex: 'purchase_account',
  },
  {
    title: 'Tax rate',
    dataIndex: 'purchase_tax_rate',
  },
  {
    title: 'Amount',
    dataIndex: 'purchase_amount',
  },
]
const dataSource = [
  {
    key: '1',
    item: '12',
    quantity: '1',
    description: 'test',
    index: 1,
    unitPrice: '2',
    discount: '5',
    account: '',
    taxRate: '2',
    amount: '11',
  },
]

const InventoryAdjustmentDetailPage = routerData => {
  // console.log(routerData, 'routerData')
  // const routeName = routerData.match.path.split('/')[2]

  const [quoteData, getQuotation] = useState([])
  const { id: quoteId } = routerData.match.params

  useEffect(() => {
    if (quoteId) {
      // console.log(quoteId, 'quoteId ifff')
      const fetchData = async () => {
        const result = await InventoryService.getInventoryListById(quoteId, 'post')
        // console.log(result, 'result')
        getQuotation(result ? result.data : [])
      }
      fetchData()
    }
  }, [quoteId])

  return <div>Details Page</div>
}

export default connect()(InventoryAdjustmentDetailPage)

