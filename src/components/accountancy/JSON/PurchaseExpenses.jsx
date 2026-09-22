import React from 'reacrt'
import HelperFunction from '@/services/helper'
import { Link } from 'react-router-dom'

const PurchaseAndExpenses = {
  purchaseByVendor: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Purchase Date',
      name: 'Purchase_Date',
      dataIndex: 'Purchase_Date',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      render: (text, record) => {
        return HelperFunction.dateFormatted(record.Purchase_Date)
      },
    },
    {
      title: 'Invoice No',
      name: 'invoice_no',
      dataIndex: 'invoice_no',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      render: (text, record, index) => (
        <Link className="hrefLink" to={`/purchase/invoice/${record.invoice_no}`}>
          {' '}
          {record.invoice_no}
        </Link>
      ),
    },
    {
      title: 'Status',
      name: 'payment_status',
      dataIndex: 'payment_status',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Due Amount',
      name: 'invoice_due_amount',
      dataIndex: 'invoice_due_amount',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Amount',
      name: 'total',
      dataIndex: 'total',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },

    // {
    //   title: 'Sale Without Tax',
    //   dataIndex: 'sale_without_tax',
    //   name: 'sale_without_tax',
    //   responsive: ['xs', 'sm'],
    // },
  ],
  purchaseByItem: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Product Name',
      name: 'product_name',
      dataIndex: 'product_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      // render: (text, record, index) => (
      //   <Link className="hrefLink" to={`/products-and-services/product/${record.product_id}`}>
      //     {' '}
      //     {record.product_name}
      //   </Link>
      // ),
    },
    {
      title: 'Buy Quantity',
      name: 'buy_qty',
      dataIndex: 'buy_qty',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Average Price',
      name: 'average_price',
      dataIndex: 'average_price',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      name: 'Amount',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
  expenseDetails: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Date',
      name: 'date',
      dataIndex: 'date',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      render: (text, record) => {
        return HelperFunction.dateFormatted(record.date)
      },
    },
    {
      title: 'Expense No',
      name: 'expense_no',
      dataIndex: 'expense_no',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Payment Mode',
      name: 'payment_mode',
      dataIndex: 'payment_mode',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      name: 'total',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
  expenseByCategory: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Expense Account',
      name: 'expenses_act',
      dataIndex: 'expenses_act',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Total Expense',
      name: 'totalexpense',
      dataIndex: 'totalexpense',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
}

export default PurchaseAndExpenses
