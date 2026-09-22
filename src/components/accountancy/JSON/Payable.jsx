import React from 'react'
import HelperFunction from '@/services/helper'
import { Link } from 'react-router-dom'

const Payable = {
  vendorBalance: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Vendor Name',
      name: 'vendor_name',
      dataIndex: 'vendor_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/report/Purchase By Vendor/${dt.venodr_id}`}>
            {' '}
            {dt.vendor_name}
          </Link>
        )
      },
    },
    {
      title: 'Paid Amount',
      name: 'paid_amt',
      dataIndex: 'paid_amt',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Total Purchase',
      name: 'total_purchase',
      dataIndex: 'total_purchase',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Balance',
      name: 'balance',
      dataIndex: 'balance',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
  vendorBalSummary: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Vendor Name',
      name: 'vendor_name',
      dataIndex: 'vendor_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/report/Purchase By Vendor/${dt.venodr_id}`}>
            {' '}
            {dt.vendor_name}
          </Link>
        )
      },
    },
    {
      title: 'Paid Amount',
      name: 'paid_amt',
      dataIndex: 'paid_amt',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Total Purchase',
      name: 'total_purchase',
      dataIndex: 'total_purchase',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Balance',
      name: 'balance',
      dataIndex: 'balance',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
  billsDetails: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Invoice No',
      name: 'invoice_no',
      dataIndex: 'invoice_no',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/purchase/invoice/${dt.invoice_no}`}>
            {' '}
            {dt.invoice_no}
          </Link>
        )
      },
    },
    {
      title: 'Vendor Name',
      name: 'vendor_name',
      dataIndex: 'vendor_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      name: 'payment_status',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Bill Amount',
      dataIndex: 'bill_amount',
      name: 'bill_amount',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },

    {
      title: 'Balance Amount',
      dataIndex: 'balance_amount',
      name: 'balance_amount',
      responsive: ['xs', 'sm'],
    },
  ],
  vendorCreditDetails: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Date',
      name: 'pur_return_date',
      dataIndex: 'pur_return_date',
      responsive: ['xs', 'sm'],
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return HelperFunction.dateFormatted(dt.pur_return_date)
      },
    },
    {
      title: 'Vendor Name',
      name: 'vendor_name',
      dataIndex: 'vendor_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Purchase Return No',
      name: 'purchase_return_no',
      dataIndex: 'purchase_return_no',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      name: 'amount',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
  paymentMade: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Date',
      name: 'payment_date',
      dataIndex: 'payment_date',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return HelperFunction.dateFormatted(dt.payment_date)
      },
      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.payment_date)
      // },
    },
    {
      title: 'Vendor Name',
      name: 'vendor_name',
      dataIndex: 'vendor_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Payment No',
      name: 'payment_no',
      dataIndex: 'payment_no',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Payment Mode',
      dataIndex: 'payment_mode',
      name: 'payment_mode',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Paid Amount',
      dataIndex: 'amount_paid',
      name: 'amount_paid',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
  purchaseOrderDetails: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Date',
      name: 'poDate',
      dataIndex: 'poDate',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return HelperFunction.dateFormatted(dt.poDate)
      },
      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.poDate)
      // },
    },
    {
      title: 'Vendor Name',
      name: 'VendorName',
      dataIndex: 'VendorName',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Purchase Order No',
      name: 'purchase_order_no',
      dataIndex: 'purchase_order_no',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/purchase/order/${dt.purchase_order_no}`}>
            {' '}
            {dt.purchase_order_no}
          </Link>
        )
      },
      // render: (text, record, index) => (
      //   <Link className="hrefLink" to={`/purchase/order/${record.purchase_order_no}`}>
      //     {' '}
      //     {record.purchase_order_no}
      //   </Link>
      // ),
    },
    {
      title: 'Status',
      name: 'accept_status',
      dataIndex: 'accept_status',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      name: 'amount',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
  purchaseOrderByVendor: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Vendor Name',
      name: 'vendor_name',
      dataIndex: 'vendor_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/report/Purchase By Vendor/${dt.venodr_id}`}>
            {' '}
            {dt.vendor_name}
          </Link>
        )
      },
      // render: (text, record) => {
      //   return (
      //     <Link to={`/report/Purchase By Vendor/${record.venodr_id}`}>{record.vendor_name}</Link>
      //   )
      // }
    },
    {
      title: 'Order Count',
      dataIndex: 'order_count',
      name: 'order_count',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      name: 'total_amount',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
  payableSummary: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Date',
      name: 'Purchase_Date',
      dataIndex: 'Purchase_Date',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return HelperFunction.dateFormatted(dt.Purchase_Date)
      },
      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.Purchase_Date)
      // },
    },
    {
      title: 'Invoice No',
      name: 'invoice_no',
      dataIndex: 'invoice_no',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/purchase/invoice/${dt.invoice_no}`}>
            {' '}
            {dt.invoice_no}
          </Link>
        )
      },
      // render: (text, record, index) => (
      //   <Link className="hrefLink" to={`/purchase/invoice/${record.invoice_no}`}>
      //     {' '}
      //     {record.invoice_no}
      //   </Link>
      // ),
    },
    {
      title: 'Vendor Name',
      name: 'vendor_name',
      dataIndex: 'vendor_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      name: 'payment_status',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Balance Amount',
      dataIndex: 'balance_amt',
      name: 'balance_amt',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },

    {
      title: 'Total Without Tax',
      dataIndex: 'total_amt_without_tax',
      name: 'total_amt_without_tax',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Bill Amount',
      dataIndex: 'bill_amt',
      name: 'bill_amt',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
}

export default Payable
