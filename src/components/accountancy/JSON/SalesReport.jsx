const SalesReport = {
  salesByCustomer: [
    [
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
        // render: (text, record, index) => (
        //   <Link className="hrefLink" to={`/report/${reportName}/${record.customer_id}`}>
        //     {' '}
        //     {record.customername}
        //   </Link>
        // ),
      },
      {
        title: 'Invoice Count',
        name: 'invoice_count',
        dataIndex: 'invoice_count',
        responsive: ['xs', 'sm'],
        filter: 'agTextColumnFilter',
      },
      {
        title: 'Total Sale',
        name: 'total_sale',
        dataIndex: 'total_sale',
        responsive: ['xs', 'sm'],
        filter: 'agTextColumnFilter',
      },
      {
        title: 'Sale Without Tax',
        dataIndex: 'sale_without_tax',
        name: 'sale_without_tax',
        responsive: ['xs', 'sm'],
        filter: 'agTextColumnFilter',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        name: 'action',
        responsive: ['xs', 'sm'],
        filter: 'agTextColumnFilter',
        // render: (text, record, index) => (
        //   <Link className="hrefLink" to={`/report/${reportName}/${record.customer_id}`}>
        //     {' '}
        //     Click Here
        //   </Link>
        // ),
      },
    ],
  ],
  salesByItem: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
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
      title: 'Sold Quantity',
      name: 'sold_qty',
      dataIndex: 'sold_qty',
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
  datewiseInventory: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Product Name',
      name: 'item_name',
      dataIndex: 'item_name',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Purchase',
      name: 'Purchase',
      dataIndex: 'Purchase',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Purchase Return',
      name: 'Purchase_Return',
      dataIndex: 'Purchase_Return',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Sale',
      dataIndex: 'Sale',
      name: 'Sale',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Sate Return',
      name: 'Sale_Return',
      dataIndex: 'Sale_Return',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Opening Value',
      dataIndex: 'openingvalue',
      name: 'openingvalue',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Closing Value',
      dataIndex: 'closingvalue',
      name: 'closingvalue',
      responsive: ['xs', 'sm'],
      filter: 'agTextColumnFilter',
    },
  ],
}

export default SalesReport
