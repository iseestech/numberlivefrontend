import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const urlObj = {
  'sale invoice': '/sales/invoice/',
  'sale return': '/sales/return/',
  'sale payment': '/sales/payment/pay/',
  'other income': '/sale/other-income/edit/',
  'purchase invoice': '/purchase/invoice/',
  'purchase return': '/purchase/return/',
  'purchase payment': '/purchase/payment/pay/',
  expenses: '/exp/expense/',
  journal: '/accounts/journal/',
  'reverse journal': '/accounts/rev-journals/',
  'vendor advance': '/purchase/vendorPayment/pay/',
}

const BuisnessOverviewCols = {
  cashFlowStatement: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Date',
      name: 'date',
      dataIndex: 'date',
      filter: 'agTextColumnFilter',

      // responsive: ['xs', 'sm'],
      // render: (text, record, index) => (
      //   <span>{HelperFunction.dateFormatted(`${record.month}/1/${record.Year}`)}</span>
      // ),
    },
    {
      title: 'Closing Value',
      name: 'closingvalue',
      dataIndex: 'closingvalue',
      filter: 'agTextColumnFilter',

      // responsive: ['xs', 'sm'],
    },
    {
      title: 'Opening Value',
      dataIndex: 'openingvalue',
      name: 'openingvalue',
      filter: 'agTextColumnFilter',

      // responsive: ['xs', 'sm'],
    },
    {
      title: 'In Flow',
      dataIndex: 'InFlow',
      name: 'InFlow',
      filter: 'agTextColumnFilter',

      // responsive: ['xs', 'sm'],
    },
    {
      title: 'Out Flow',
      dataIndex: 'OutFlow',
      name: 'OutFlow',
      // responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
  statementByDate: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      name: 'date',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',

      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.date)
      // },
    },
    {
      title: 'Transaction Id',
      name: 'transaction_id',
      dataIndex: 'transaction_id',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',

      // sorter: (a, b) => a.transaction_id.localeCompare(b.transaction_id),
    },
    {
      title: 'Act Name',
      name: 'act_name',
      dataIndex: 'act_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',

      // sorter: (a, b) => a.act_name.localeCompare(b.act_name || ''),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      name: 'type',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',

      // sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: 'Credit',
      dataIndex: 'Credit',
      name: 'Credit',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',

      // sorter: (a, b) => a.Credit.localeCompare(b.Credit),
    },
    {
      title: 'Debit',
      dataIndex: 'Debit',
      name: 'Debit',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',

      // sorter: (a, b) => a.Debit.localeCompare(b.Debit),
    },
  ],
  statementOfAccount: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Transaction Id',
      name: 'transaction_id',
      dataIndex: 'transaction_id',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data
        const poNumber = dt && dt.transaction_id
        // let url = '';

        // if (dt?.type === 'expenses') {
        //   url = `/exp/expense/${poNumber}`
        // } else if (dt?.type === 'purchase invoice') {
        //   url = `/purchase/invoice/${poNumber}`
        // } else {
        //   console.log("test")
        // }

        return (
          <Link
            to={`${urlObj[dt?.type]}${poNumber}`}
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            <span className="viewIcon">{poNumber}</span>
          </Link>
        )
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      name: 'date',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',

      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.date)
      // },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      name: 'type',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Credit',
      dataIndex: 'Credit',
      name: 'Credit',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Debit',
      dataIndex: 'Debit',
      name: 'Debit',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
  statementBySubGroup: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Act Name',
      name: 'act_name',
      dataIndex: 'act_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      name: 'date',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',

      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.date)
      // },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      name: 'type',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Credit',
      dataIndex: 'Credit',
      name: 'Credit',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Debit',
      dataIndex: 'Debit',
      name: 'Debit',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
  statementByPriGroup: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Act Name',
      name: 'act_name',
      dataIndex: 'act_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      name: 'date',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',

      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.date)
      // },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      name: 'type',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Credit',
      dataIndex: 'Credit',
      name: 'Credit',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Debit',
      dataIndex: 'Debit',
      name: 'Debit',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
  statementOfNatureAcc: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Act Name',
      name: 'act_name',
      dataIndex: 'act_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      name: 'date',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',

      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.date)
      // },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      name: 'type',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Credit',
      dataIndex: 'Credit',
      name: 'Credit',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Debit',
      dataIndex: 'Debit',
      name: 'Debit',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
}

export default BuisnessOverviewCols
