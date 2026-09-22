import apiClient from '@/services/axios'
import store from 'store'

const QuotationService = {
  quotationList: orgCode => {
    return apiClient
      .get(`/isees/api/salesquoteall/data?orgCode=${orgCode}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  quotationListBk: () => {
    return apiClient
      .get('/isees/api/salesQuotation/all')
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  createQuotation: (values, method) => {
    let url = '/isees/api/salesQuotation/save'
    if (method === 'put') {
      url = '/isees/api/salesQuotation/update'
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getQuotation: id => {
    return apiClient
      .get(`/isees/api/salesQuotation/id?quoteNo=${id}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  // orderList: () => {
  //   return apiClient
  //     .get('/isees/api/saleorder/all')
  //     .then(response => {
  //       return response.data && response.data
  //     })
  //     .catch(err => console.log(err))
  // },saleorderlistview/data
  orderList: orgCode => {
    return apiClient
      .get(`/isees/api/saleorderlistview/data?orgCode=${orgCode}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  createOrder: (values, method) => {
    let url = '/isees/api/saleorder/save'
    if (method === 'put') {
      url = '/isees/api/saleorder/update'
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getOrder: id => {
    return apiClient
      .get(`/isees/api/saleorder/id?orderNo=${id}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  // invoiceList: () => {
  //   return apiClient
  //     .get('/isees/api/SalesInvoice/all')
  //     .then(response => {
  //       return response.data && response.data
  //     })
  //     .catch(err => console.log(err))
  // },
  invoiceList: orgCode => {
    return apiClient
      .get(`/isees/api/salesinvoicelistview/data?orgCode=${orgCode}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  createInvoice: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/api/SalesInvoice/save'
    if (method === 'put') {
      url = '/isees/api/SalesInvoice/update'
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getInvoice: id => {
    return apiClient
      .get(`/isees/api/SalesInvoice/id?invoiceNo=${id}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  approveInvoice: value => {
    return apiClient
      .get(`/isees/api/SalesInvoice/invoiceStatus?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  convertTo: (values, method, fromOrder) => {
    let url = '/isees/api/salesQuotation/save'
    if (fromOrder === 'order') {
      url = '/isees/api/saleorder/save'
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  deleteActivity: (id, value) => {
    const param = value === 'salesQuotation' ? 'Customer_id' : 'id'

    return apiClient
      .delete(`/isees/api/${value}/delete?${param}=${id}`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  deleteSalesPayment: id => {
    return apiClient
      .delete(`/isees/api/salesPayment/delete?paymentNo=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  deleteOtherIncome: id => {
    return apiClient
      .delete(`/isees/api/otherIncome/delete?id=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  convertToOrder: value => {
    return apiClient
      .get(`/isees/api/salesQuotation/quoteStatus?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  convertToInvoice: value => {
    return apiClient
      .get(`/isees/api/saleorder/orderStatus?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  updateSaleReturn: (values, method) => {
    console.log(values, 'from services')
    const url = '/isees/api/purchaseOrder/savePurchaseReturn'

    return apiClient
      .post(url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  saveSalesReturn: value => {
    return apiClient
      .post('/isees/api/salesQuotation/saveSalesReturn', value)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getAllSalesReturn: value => {
    return apiClient
      .get(`/isees/api/salesinvoicelistview/salesreturnall?orgCode=${value}`)
      .then(response => {
        return response && response
      })
      .catch(err => console.log(err))
  },
  getSalesReturnById: value => {
    return apiClient
      .get(`/isees/api/salesQuotation/getSalesReturnById?salesReturnNo=${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getAllSalesPayment: value => {
    return apiClient
      .get('/isees/api/salesPayment/all')
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getSalesPayment: value => {
    return apiClient
      .get(`/isees/api/salesPayment/id?paymentNo=${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },

  saveSalesPayment: (value, method) => {
    let url = '/isees/api/salesPayment/saveSalePayment'
    if (method === 'put') {
      url = '/isees/api/salesPayment/update'
    }
    return apiClient[method](url, value)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  salesInvoicePayment: orgCode => {
    return apiClient
      .get(`isees/api/salesinvoicelistview/paymentdata?orgCode=${orgCode}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  // getUnpaidInvoice: id => {
  //   return apiClient
  //     .get(`isees/api/salesPayment/getByUnpaidInvoices?cust_id=${id}`)
  //     .then(response => {
  //       return response.data && response.data
  //     })
  //     .catch(err => console.log(err))
  // },
  getUnpaidInvoice: (id, orgCode) => {
    return apiClient
      .get(`isees/api/saleinvoicedetails/data?customerId=${id}&orgCode=${orgCode}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },

  getAllOtherIncome: () => {
    return apiClient
      .get('/isees/api/otherIncome/all')
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  createOtherIncome: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/api/otherIncome/save'
    if (method === 'put') {
      url = '/isees/api/otherIncome/update'
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getOtherIncome: id => {
    return apiClient
      .get(`/isees/api/otherIncome/id?id=${id}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  // Sale Quote Report
  getSaleQuoteAll: value => {
    return apiClient
      .get(`/isees/api/salesquoteall/data?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getSaleQuoteDateWise: value => {
    return apiClient
      .get(`/isees/api/salesquoteall/datewisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getSaleQuoteMonthWise: value => {
    return apiClient
      .get(`/isees/api/salesquoteall/monthwisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getSaleQuoteYearWise: value => {
    return apiClient
      .get(`/isees/api/salesquoteall/yearwisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  // Sales Order
  getSaleOrderAll: value => {
    return apiClient
      .get(`/isees/api/saleorderlistview/data?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getSaleOrderDateWise: value => {
    return apiClient
      .get(`/isees/api/saleorderlistview/datewisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getSaleOrderMonthWise: value => {
    return apiClient
      .get(`/isees/api/saleorderlistview/monthwisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getSaleOrderYearWise: value => {
    return apiClient
      .get(`/isees/api/saleorderlistview/yearwisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  // Sales Invoice
  getSaleInvoiceAll: value => {
    return apiClient
      .get(`/isees/api/salesinvoicelistview/data?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getSaleInvoiceDateWise: value => {
    return apiClient
      .get(`/isees/api/salesinvoicelistview/datewisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getSaleInvoiceMonthWise: value => {
    return apiClient
      .get(`/isees/api/salesinvoicelistview/monthwisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getSaleInvoiceYearWise: value => {
    return apiClient
      .get(`/isees/api/salesinvoicelistview/yearwisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
}

export default QuotationService
