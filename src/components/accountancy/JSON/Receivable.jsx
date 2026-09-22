import React from 'react'
import { Link } from 'react-router-dom'
import HelperFunction from '@/services/helper'

const Receivable = {
  customerBalance: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Customer Name',
      name: 'customername',
      dataIndex: 'customername',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/report/Sales By Customer/${dt.customer_id}`}>
            {' '}
            {dt.customername}
          </Link>
        )
      },
    },
    {
      title: 'Received Amount',
      name: 'received_amt',
      dataIndex: 'received_amt',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
    {
      title: 'Total Sale',
      name: 'total_sale',
      dataIndex: 'total_sale',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
    {
      title: 'Balance',
      name: 'balance',
      dataIndex: 'balance',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      name: 'action',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        const reportName = 'test'
        return (
          <Link className="hrefLink" to={`/report/${reportName} Details/${dt.customer_id}`}>
            {' '}
            Click Here
          </Link>
        )
      },
    },
  ],
  customerBalanceDet: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Date',
      name: 'estimate_date',
      dataIndex: 'estimate_date',
      filter: 'agTextColumnFilter',

      responsive: ['xs', 'sm'],
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return HelperFunction.dateFormatted(dt.estimate_date)
      },
      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.estimate_date)
      // },
    },
    {
      title: 'Invoice No',
      name: 'invoice_no',
      dataIndex: 'invoice_no',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Invoice Due Amt',
      dataIndex: 'invoice_due_amount',
      name: 'invoice_due_amount',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
    {
      title: 'Total Amt without Tax',
      dataIndex: 'total_amt_without_tax',
      name: 'total_amt_without_tax',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
    {
      title: 'Payment Status',
      name: 'payment_status',
      dataIndex: 'payment_status',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      name: 'status',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      name: 'total',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
  ],
  salesInvoiceReport: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Invoice#',
      dataIndex: 'invoiceno',
      key: 'invoiceno',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/sales/invoice/${dt.invoiceno}`}>
            {' '}
            {dt.invoiceno}
          </Link>
        )
      },

      // render: (text, record, index) => (
      //   <Link to={`/sales/invoice/${record.invoiceno}`}> {record.invoiceno}</Link>
      // ),
    },
    // {
    //   title: 'Reference',
    //   dataIndex: 'reference',
    //   key: 'reference',
    // },
    {
      title: 'Customer',
      dataIndex: 'customername',
      key: 'customername',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/sales/invoice/${dt.invoiceno}`}>
            {' '}
            {dt.customername}
          </Link>
        )
      },

      // render: (text, record) => {
      //   return (
      //     <Link className="hrefLink" to={`/report/Sales By Customer/${record.customerid}`}>
      //       {record.customername}
      //     </Link>
      //   )
      // },
    },
    {
      title: 'Date',
      dataIndex: 'estimateDate',
      key: 'estimateDate',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return HelperFunction.dateFormatted(dt.estimateDate)
      },
      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.estimateDate)
      // },
    },
    // {
    //   title: 'Expiry',
    //   dataIndex: 'expiryDate',
    //   key: 'expiryDate',
    // },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    // },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
    // {
    //   title: 'Actions',
    //   dataIndex: 'actions',
    //   key: 'actions',
    //   render: (text, record) => {
    //     // console.log(text, record)
    //     return (
    //       <span>
    //         <Link to={`/sales/invoice/${record.invoiceno}`}>click here</Link>
    //         {record.accepted === 'APPROVE' && (
    //           <Link to={`/sales/invoice/${record.invoiceno}`}> | Pay</Link>
    //         )}
    //       </span>
    //     )
    //   },
    // },
  ],
  salesOrderReport: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Order#',
      dataIndex: 'orderno',
      key: 'orderno',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/sales/order/${dt.orderno}`}>
            {' '}
            {dt.orderno}
          </Link>
        )
      },
      // render: (text, record, index) => (
      //   <Link to={`/sales/order/${record.orderno}`}> {record.orderno}</Link>
      // ),
    },
    // {
    //   title: 'Reference',
    //   dataIndex: 'reference',
    //   key: 'reference',
    // },
    {
      title: 'Customer',
      dataIndex: 'customername',
      key: 'customername',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/report/Sales By Customer/${dt.customerid}`}>
            {' '}
            {dt.customername}
          </Link>
        )
      },

      // render: (text, record) => {
      //   return (
      //     <Link to={`/report/Sales By Customer/${record.customerid}`}>{record.customername}</Link>
      //   )
      // }
    },
    {
      title: 'Date',
      dataIndex: 'estimateDate',
      key: 'estimateDate',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return HelperFunction.dateFormatted(dt.estimateDate)
      },

      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.estimateDate)
      // },
    },
    {
      title: 'Expiry',
      dataIndex: 'expirydate',
      key: 'expirydate',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return HelperFunction.dateFormatted(dt.expirydate)
      },
      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.expirydate)
      // },
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    // },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
    // {
    //   title: 'Actions',
    //   dataIndex: 'actions',
    //   key: 'actions',
    //   render: (text, record) => {
    //     // console.log(text, record)
    //     return <Link to={`/sales/order/${record.orderNo}`}>click here</Link>
    //   },
    // },
  ],
  salesQuoteReport: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Quote#',
      dataIndex: 'quote_number',
      key: 'quoteNumber',
      filterSearch: true,
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/sales/quotation/${dt.quote_number}`}>
            {' '}
            {dt.quote_number}
          </Link>
        )
      },

      // render: (text, record, index) => (
      //   <Link to={`/sales/quotation/${record.quote_number}`}> {record.quote_number}</Link>
      // ),
    },
    // {
    //   title: 'Reference',
    //   dataIndex: 'reference',
    //   key: 'reference',
    // },
    {
      title: 'Customer',
      dataIndex: 'customername',
      key: 'customerName',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/contacts/customer/edit/${dt.customer_id}`}>
            {' '}
            {/* {`${dt.firstName} ${dt.lastName}`} */}
            {dt.customername}
          </Link>
        )
      },
      // render: (text, record) => {
      //   return (
      //     <Link to={`/sales/quotation/${record.id}`}>{`${record.firstName} ${record.lastName}`}</Link>
      //   )
      // },
    },
    {
      title: 'Date',
      dataIndex: 'estimateDate',
      key: 'estimateDate',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return HelperFunction.dateFormatted(dt.estimateDate)
      },

      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.estimateDate)
      // },
    },
    {
      title: 'Expiry',
      dataIndex: 'expiry_date',
      key: 'expiryDate',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return HelperFunction.dateFormatted(dt.expiry_date)
      },
      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.expiry_date)
      // },
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'accept_status',
    //   key: 'status',
    // },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
    // {
    //   title: 'Actions',
    //   dataIndex: 'actions',
    //   key: 'actions',
    //   render: (text, record) => {
    //     // console.log(text, record)
    //     return <Link to={`/sales/quotation/${record.quote_number}`}>click here</Link>
    //   },
    // },
  ],
  receivableSummary: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',

      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Date',
      name: 'estimate_date',
      dataIndex: 'estimate_date',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return HelperFunction.dateFormatted(dt.estimate_date)
      },
      // render: (text, record) => {
      //   return HelperFunction.dateFormatted(record.estimate_date)
      // },
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
          <Link className="hrefLink" to={`/sales/invoice/${dt.invoice_no}`}>
            {dt.invoice_no}
          </Link>
        )
      },
      // render: (text, record, index) => (
      //   <Link className="hrefLink" to={`/sales/invoice/${record.invoice_no}`}>
      //     {' '}
      //     {record.invoice_no}
      //   </Link>
      // ),
    },
    {
      title: 'Customer Name',
      name: 'customername',
      dataIndex: 'customername',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: params => {
        const dt = params?.data || {}
        return (
          <Link className="hrefLink" to={`/report/Sales By Customer/${dt.customerid}`}>
            {dt.customername}
          </Link>
        )
      },
      // render: (text, record) => {
      //   return (
      //     <Link to={`/report/Sales By Customer/${record.customerid}`}>{record.customername}</Link>
      //   )
      // }
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      name: 'payment_status',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Due Amount',
      dataIndex: 'invoice_due_amount',
      name: 'invoice_due_amount',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },

    {
      title: 'Total Without Tax',
      dataIndex: 'total_amt_without_tax',
      name: 'total_amt_without_tax',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      name: 'total',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
  ],
}

export default Receivable
