import HelperFunction from '@/services/helper'

const Inventory = {
  stocks: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Stock#',
      dataIndex: 'id',
      key: 'id',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Product Name',
      dataIndex: 'item_name',
      key: 'item_name',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Opening Stock',
      dataIndex: 'opening_stock',
      key: 'opening_stock',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Purchase',
      dataIndex: 'pqty',
      key: 'pqty',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Purchase Return',
      dataIndex: 'rqty',
      key: 'rqty',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Sales',
      dataIndex: 'sqty',
      key: 'sqty',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Sales Return',
      dataIndex: 'srqty',
      key: 'srqty',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Adjusted Qty',
      dataIndex: 'adjusted_qty',
      key: 'adjusted_qty',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Closing Stock1',
      dataIndex: 'closing_stock',
      key: 'closing_stock',
      filter: 'agTextColumnFilter',
    },
  ],
  inventoryAdj: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Mode of adjustment',
      dataIndex: 'modeOfAdjustment',
      key: 'modeOfAdjustment',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Reference',
      dataIndex: 'referenceNumber',
      key: 'referenceNumber',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Discription',
      dataIndex: 'discription',
      key: 'discription',
      filter: 'agTextColumnFilter',
    },
  ],
  expenses: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Expense Account',
      dataIndex: 'expAccount',
      key: 'expAccount',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Paid Through',
      dataIndex: 'paidThrough',
      key: 'paidThrough',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
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
  stockOnHand: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Group Name',
      dataIndex: 'groupname',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Category Name',
      dataIndex: 'catname',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Product Id',
      dataIndex: 'productId',
      key: 'productId',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Product Name',
      dataIndex: 'productname',
      key: 'productname',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Stock On Hand',
      dataIndex: 'stockonhand',
      key: 'stockonhand',
      filter: 'agTextColumnFilter',
    },
  ],
}

export default Inventory
