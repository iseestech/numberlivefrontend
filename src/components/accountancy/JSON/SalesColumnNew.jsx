import HelperFunction from '@/services/helper'

const salesColumns = {
  salesQuotesCols: [
    {
      dataIndex: 'key',
      key: 'key',
      title: 'Key',
      filter: 'agNumberColumnFilter',
    },
    {
      dataIndex: 'quote_number',
      key: 'quote_number',
      title: 'Quote#',
      filter: 'agTextColumnFilter',
    },
    {
      dataIndex: 'customername',
      key: 'customername',
      title: 'Customer',
      filter: 'agTextColumnFilter',
    },
    {
      dataIndex: 'estimateDate',
      key: 'estimateDate',
      title: 'Date',
      filter: 'false',
    },
    {
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      title: 'Expiry',
      filter: 'agNumberColumnFilter',
    },
    {
      dataIndex: 'accept_status',
      key: 'accept_status',
      title: 'Status',
      filter: 'agTextColumnFilter',
    },
    {
      dataIndex: 'total',
      key: 'total',
      title: 'Amount',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
  ],
  salesOrdersCols: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
      checkboxSelection: params => {
        return !!params.data && params.data.status === 'ACCEPTED'
      },
    },
    {
      title: 'Order#',
      dataIndex: 'orderno',
      key: 'orderno',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Customer',
      dataIndex: 'customername',
      key: 'customername',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Date',
      dataIndex: 'estimateDate',
      key: 'estimateDate',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Expiry',
      dataIndex: 'expirydate',
      key: 'expirydate',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
  ],
  SalesInvoiceCols: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Invoice#',
      dataIndex: 'invoiceno',
      key: 'invoiceno',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Customer',
      dataIndex: 'customername',
      key: 'customername',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Date',
      dataIndex: 'estimateDate',
      key: 'estimateDate',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Status',
      dataIndex: 'paymentstatus',
      key: 'paymentstatus',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
  ],
  SalesReturnCols: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Return#',
      dataIndex: 'sale_return_no',
      key: 'sale_return_no',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Date',
      dataIndex: 'sale_return_date',
      key: 'sale_return_date',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer_name',
      key: 'customer_name',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Return Value',
      dataIndex: 'amount',
      key: 'amount',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
  ],
  SalesPaymentCols: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Payment#',
      dataIndex: 'paymentno',
      key: 'paymentno',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Refference',
      dataIndex: 'refference',
      key: 'refference',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customername',
      key: 'customername',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Payment Date',
      dataIndex: 'paymentdate',
      key: 'paymentdate',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Amount',
      dataIndex: 'amountreceived',
      key: 'amountreceived',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
  ],
  SalesOtherIncomeCols: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'ID #',
      dataIndex: 'id',
      key: 'id',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'reference',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Reference',
      dataIndex: 'ref',
      key: 'ref',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
  ],
}

export default salesColumns
