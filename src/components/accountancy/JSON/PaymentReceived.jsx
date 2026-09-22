import React from 'reacrt'
import HelperFunction from '@/services/helper'

const PaymentReceived = {
  paymentReceived: [
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
      render: (text, record) => {
        return HelperFunction.dateFormatted(record.payment_date)
      },
    },
    {
      title: 'Customer Name',
      name: 'customer_name',
      dataIndex: 'customer_name',
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
      title: 'Account Name',
      dataIndex: 'act_name',
      name: 'act_name',
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
      title: 'Received Amount',
      dataIndex: 'amount_recieved',
      name: 'amount_recieved',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
  debitNotes: [
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
      filter: 'agTextColumnFilter',
      render: (text, record) => {
        return HelperFunction.dateFormatted(record.pur_return_date)
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
    //   {
    //     title: 'Status',
    //     name: 'accept_status',
    //     dataIndex: 'accept_status',
    //     responsive: ['xs', 'sm'],
    //   },
    {
      title: 'Amount',
      dataIndex: 'amount',
      name: 'amount',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
  creditNotes: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Date',
      name: 'sale_return_date',
      dataIndex: 'sale_return_date',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      render: (text, record) => {
        return HelperFunction.dateFormatted(record.sale_return_date)
      },
    },
    {
      title: 'Customer Name',
      name: 'customer_name',
      dataIndex: 'vendor_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Sale Return No',
      name: 'sale_return_no',
      dataIndex: 'sale_return_no',
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
}

export default PaymentReceived
