import apiClient from '@/services/axios'
import queryString from 'query-string'
import store from 'store'

const PurchaseService = {
  purchaseOrderList: () => {
    return apiClient
      .get('/isees/api/purchaseOrder/all')
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  purchaseOrderListNew: params => {
    return apiClient
      .get(`/isees/api/fetchFromView/data?orgCode=${params.orgCode}`)
      .then(response => {
        console.log(response, 'rrrrrrr')
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getPurchaseOrderDateWise: value => {
    return apiClient
      .get(`/isees/api/fetchFromView/datewisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getPurchaseOrderMonthWise: value => {
    return apiClient
      .get(`/isees/api/fetchFromView/monthwisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getPurchaseOrderYearWise: value => {
    return apiClient
      .get(`/isees/api/fetchFromView/yearwisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  createPurchaseOrder: (values, method) => {
    const qs = queryString.stringify(values)
    console.log(values, 'from services')
    let url = 'isees/api/purchaseOrder/save'
    if (method === 'put') {
      url = 'isees/api/purchaseOrder/update'
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getPurchaseOrder: id => {
    return apiClient
      .get(`/isees/api/purchaseOrder/id?purchaseOrderNo=${id}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  approveOrder: value => {
    return apiClient
      .get(`/isees/api/purchaseOrder/purchaseInvoiceStatus?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  purchaseInvoiceList: () => {
    return apiClient
      .get('/isees/api/purchaseOrder/getAllPurchaseInvoice')
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  purchaseInvoiceListNew: params => {
    // /api/purchaseinvoicelistview/data
    // api/purchaseOrder/getAllPurchaseInvoice
    return apiClient
      .get(`/isees/api/purchaseinvoicelistview/data?orgCode=${params.orgCode}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  createPurchaseInvoice: (values, method) => {
    const qs = queryString.stringify(values)
    console.log(values, 'from services')
    let url = 'isees/api/purchaseOrder/addPurchaseInvoice'
    if (method === 'put') {
      url = 'isees/api/purchaseOrder/updatePurchaseInvoice'
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getPurchaseInvoice: id => {
    return apiClient
      .get(`/isees/api/purchaseOrder/getPurchaseInvoiceById?purchaseInvoiceNo=${id}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  approvePurchaseInvoice: value => {
    return apiClient
      .get(`/isees/api/purchaseOrder/approveInvoice?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  deleteActivity: id => {
    return apiClient
      .delete(`/isees/api/purchaseOrder/delete?purchaseOrderNo=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  deleteActivityPI: id => {
    return apiClient
      .delete(`/isees/api/purchaseOrder/deletePurchaseInvoice?invoiceNo=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  updateOpeningStock: (values, method) => {
    console.log(values, 'from services')
    const url = '/isees/api/balanceConfig/updateOpeningStock'

    return apiClient
      .post(url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  updatePurchaseReturn: (values, type) => {
    console.log(values, 'from services')
    let url = '/isees/api/purchaseOrder/savePurchaseReturn'
    url = type === 'create' ? url : '/isees//api/purchaseOrder/editPurchaseReturn'

    return apiClient
      .post(url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  deletePurchasePayment: id => {
    return apiClient
      .delete(`/isees/api/purchasePayment/delete?paymentNo=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  // /isees/api/purchaseOrder/convertToInvoice?orderId=1&status=true&vendor_id=1
  purchaseConvertToInvoice: (values, method) => {
    // console.log(values, 'from services')
    const url = '/isees/api/purchaseOrder/convertToInvoice'

    return apiClient
      .get(`${url}?${values}`)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  savePurchaseReturn: (value, type) => {
    let url = '/isees/api/purchaseOrder/savePurchaseReturn'
    url = type === 'create' ? url : '/isees//api/purchaseOrder/editPurchaseReturn'
    return apiClient
      .post(url, value)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getPurchaseReturn: id => {
    return apiClient
      .get(`/isees/api/purchaseOrder/getPurchaseReturnById?purchaseReturnNo=${id}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  // getAllPurchaseReturn: value => {
  //   return apiClient
  //     .get('/isees/api/purchaseOrder/allPurchaseReturn')
  //     .then(response => {
  //       return response.data && response.data
  //     })
  //     .catch(err => console.log(err))
  // },
  getAllPurchaseReturn: orgCode => {
    return apiClient
      .get(`/isees/api/purchasereturnlistview/data?orgCode=${orgCode}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  savePurchasePayment: (value, method) => {
    let url = '/isees/api/purchasePayment/savePurchasePayment'
    if (method === 'put') {
      url = '/isees/api/purchasePayment/update'
    }
    return apiClient[method](url, value)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getUnpaidInvoice: id => {
    return apiClient
      .get(`isees/api/purchasePayment/getByUnpaidPurchaseInvoices?vendor_id=${id}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getUnpaidInvoiceNew: params => {
    return apiClient
      .get(`isees/api/purchaseinvoicedetails/data?vendorId=${params.id}&orgCode=${params.orgCode}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  // getAllPurchasePayment: value => {
  //   return apiClient
  //     .get('/isees/api/purchasePayment/all')
  //     .then(response => {
  //       return response.data && response.data
  //     })
  //     .catch(err => console.log(err))
  // },
  getAllPurchasePayment: value => {
    return apiClient
      .get(`/isees/api/purchasepaymentlistview/data?orgCode=${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getPurchasePayment: value => {
    return apiClient
      .get(`/isees/api/purchasePayment/id?paymentNo=${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getInvoiceByVendor: value => {
    return apiClient
      .get(`/isees/api/purchaseOrder/getInvoiceByVendor?vendorId=${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },

  // Purchase Invoice report services
  getPurchaseInvoiceAllData: value => {
    return apiClient
      .get(`/isees/api/purchaseinvoicelistview/data?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },

  getPurchaseInvoiceDateWise: value => {
    return apiClient
      .get(`/isees/api/purchaseinvoicelistview/datewisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getPurchaseInvoiceMonthWise: value => {
    return apiClient
      .get(`/isees/api/purchaseinvoicelistview/monthwisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getPurchaseInvoiceYearWise: value => {
    return apiClient
      .get(`/isees/api/purchaseinvoicelistview/yearwisedata?${value}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
}

export default PurchaseService
