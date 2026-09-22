import apiClient from '@/services/axios'
import queryString from 'query-string'
import store from 'store'

const ProductsService = {
  // isees/app/products/all
  productList: () => {
    return apiClient
      .get('/isees/app/products/allproduct')
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  createProduct: (values, method) => {
    const qs = queryString.stringify(values)
    console.log(values, 'from services')
    let url = '/isees/app/products/add'
    if (method === 'put') {
      url = '/isees/app/products/update'
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getProduct: id => {
    return apiClient
      .get(`/isees/app/products/id?Id=${id}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  deleteActivity: id => {
    return apiClient
      .post(`/isees/app/products/deleteProduct?id=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  // product Category,Group, Units

  getCatgoryByGrpId: id => {
    return apiClient
      .get(`/isees/app/products/idCategory?Id=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  getCategoryByGroup: id => {
    return apiClient
      .get(`/isees/app/products/getCategoryByGroup?productGroupId=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },

  productListCat: type => {
    return apiClient
      .get(`/isees/app/products/all${type}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  createProductCat: (values, method, type) => {
    // const qs = queryString.stringify(values)
    console.log(values, 'from services', method, type)
    let url = `/isees/app/products/add${type}`
    if (method === 'put') {
      url = `/isees/app/products/update${type}`
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getStockOnHand: value => {
    return apiClient
      .get(`/isees/api/Stock/stockonhand?orgCode=${value.orgCode}&productId=${value.productId}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getVerifiedBulkData: id => {
    return apiClient
      .get(`/isees/app/products/getduplicateupload?Id=${id}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  saveProductBulkUpload: id => {
    return apiClient
      .get(`/isees/app/products/savebulk`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  getProductBulkDiff: id => {
    return apiClient
      .get(`/isees/app/products/getDiff`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  getExcelDuplicate: id => {
    return apiClient
      .get(`/isees/app/products/duplicatedata`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
}

export default ProductsService
